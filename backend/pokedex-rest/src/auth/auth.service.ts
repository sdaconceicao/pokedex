import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  isAllowedOrigin,
  parseAllowedOrigins,
} from '../config/allowed-origins';
import { MailService } from '../mail/mail.service';
import { buildAlreadyRegisteredMessage } from '../mail/templates/already-registered.template';
import { buildEmailVerificationMessage } from '../mail/templates/email-verification.template';
import { buildPasswordResetMessage } from '../mail/templates/password-reset.template';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { PasswordResetResponseDTO } from './dtos/password-reset-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { AccessToken } from './types/AccessToken';
import { EmailVerificationTokenPayload } from './types/EmailVerificationTokenPayload';
import { PasswordResetTokenPayload } from './types/PasswordResetTokenPayload';

// Single constant, returned for every address. Never branch this.
const PASSWORD_RESET_REQUESTED_MESSAGE =
  'If an account exists for that address, a reset link has been sent';

// Expired, tampered, unknown user, and already-spent all collapse to this.
const INVALID_RESET_TOKEN_MESSAGE = 'Invalid or expired reset token';

// Returned for every registration attempt — new, unverified, or already
// registered. Never branch this: the reply is the only thing an attacker can
// see, so all three must be byte-identical.
const REGISTRATION_SUBMITTED_MESSAGE =
  'Check your email — we have sent you a message with next steps';

// Expired, tampered, unknown user, and already-used all collapse to this.
const INVALID_VERIFICATION_TOKEN_MESSAGE =
  'Invalid or expired verification link';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  /**
   * Signing key for reset tokens: the app secret plus the user's *current*
   * password hash. Completing a reset changes the hash, so every outstanding
   * token for that user stops verifying — single-use without a token table.
   */
  private resetTokenSecret(user: UserEntity): string {
    return `${this.configService.getOrThrow<string>('JWT_SECRET')}${user.password}`;
  }

  /**
   * Origin to build emailed links from. Preview deployments get a fresh
   * frontend URL every deploy, so no single configured value can serve them —
   * the caller's own origin can, but only once it has been matched against
   * ALLOWED_ORIGINS. Trusting the header unchecked would let anyone mail a
   * stranger a genuine reset link pointing at a host they control, which hands
   * over the token. FRONTEND_BASE_URL stays the answer for production's stable
   * domain and for callers that send no Origin at all.
   */
  private resolveFrontendBaseUrl(requestOrigin?: string): string {
    const allowedOrigins = parseAllowedOrigins(
      this.configService.get<string>('ALLOWED_ORIGINS'),
    );

    return isAllowedOrigin(requestOrigin, allowedOrigins)
      ? requestOrigin
      : this.configService.getOrThrow<string>('FRONTEND_BASE_URL');
  }

  async requestPasswordReset(
    email: string,
    requestOrigin?: string,
  ): Promise<PasswordResetResponseDTO> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const expirySeconds = parseInt(
        this.configService.get<string>(
          'PASSWORD_RESET_TOKEN_VALIDITY_DURATION_IN_SEC',
        ) ?? '900',
        10,
      );
      const payload: PasswordResetTokenPayload = { userId: user.id };
      const token = await this.jwtService.signAsync(payload, {
        secret: this.resetTokenSecret(user),
        expiresIn: expirySeconds,
      });
      const baseUrl = this.resolveFrontendBaseUrl(requestOrigin);
      const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

      // send() never throws and logs its own failures, so a mail outage
      // cannot change this endpoint's response.
      await this.mailService.send(
        buildPasswordResetMessage(
          user.email,
          resetUrl,
          Math.round(expirySeconds / 60),
        ),
      );
    }

    return { message: PASSWORD_RESET_REQUESTED_MESSAGE };
  }

  async confirmPasswordReset(
    token: string,
    password: string,
  ): Promise<AccessToken> {
    // decode() returns null for malformed input rather than throwing, and its
    // payload is untrusted — it only tells us whose password hash to build the
    // verification key from. Nothing is acted on before verifyAsync.
    const userId = this.jwtService.decode<PasswordResetTokenPayload | null>(
      token,
    )?.userId;
    const user = userId ? await this.usersService.findOneById(userId) : null;
    if (!user) {
      throw new BadRequestException(INVALID_RESET_TOKEN_MESSAGE);
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.resetTokenSecret(user),
      });
    } catch {
      // Includes already-spent tokens: the hash they were signed against no
      // longer exists, so the signature simply fails to verify.
      throw new BadRequestException(INVALID_RESET_TOKEN_MESSAGE);
    }

    const updated = await this.usersService.update(user.id, {
      password: await bcrypt.hash(password, 10),
      // Completing a reset means they read an email at this address, which is
      // exactly what verification proves — so don't strand them unverified.
      emailVerified: true,
    });
    if (!updated) {
      throw new BadRequestException(INVALID_RESET_TOKEN_MESSAGE);
    }

    return this.login(updated);
  }

  async confirmEmailVerification(token: string): Promise<AccessToken> {
    // decode() is untrusted — it only tells us whose record to build the
    // verification key from. Nothing is acted on before verifyAsync.
    const userId = this.jwtService.decode<EmailVerificationTokenPayload | null>(
      token,
    )?.userId;
    const user = userId ? await this.usersService.findOneById(userId) : null;
    if (!user) {
      throw new BadRequestException(INVALID_VERIFICATION_TOKEN_MESSAGE);
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.verificationTokenSecret(user),
      });
    } catch {
      // Also covers a second click on the same link: the key embedded the old
      // emailVerified value, so a used link no longer verifies. The user sees
      // "invalid" rather than "already verified" — the cost of no token table.
      throw new BadRequestException(INVALID_VERIFICATION_TOKEN_MESSAGE);
    }

    const updated = await this.usersService.update(user.id, {
      emailVerified: true,
    });
    if (!updated) {
      throw new BadRequestException(INVALID_VERIFICATION_TOKEN_MESSAGE);
    }

    return this.login(updated);
  }

  /**
   * Signing key for verification tokens: the app secret plus the address being
   * verified and its current state. Verifying flips emailVerified, and changing
   * the address changes the key — so a used or stale link stops verifying.
   */
  private verificationTokenSecret(user: UserEntity): string {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    return `${secret}${user.email}${String(user.emailVerified)}`;
  }

  private async sendVerificationEmail(
    user: UserEntity,
    requestOrigin?: string,
  ): Promise<void> {
    const expirySeconds = parseInt(
      this.configService.get<string>(
        'EMAIL_VERIFICATION_TOKEN_VALIDITY_DURATION_IN_SEC',
      ) ?? '86400',
      10,
    );
    const payload: EmailVerificationTokenPayload = { userId: user.id };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.verificationTokenSecret(user),
      expiresIn: expirySeconds,
    });
    const baseUrl = this.resolveFrontendBaseUrl(requestOrigin);
    const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

    await this.mailService.send(
      buildEmailVerificationMessage(
        user.email,
        verifyUrl,
        Math.round(expirySeconds / 3600),
      ),
    );
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity | null =
      await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    // Checked only after the password matches: otherwise a wrong password on
    // an unverified account would still confirm the address is registered.
    if (!user.emailVerified) {
      throw new BadRequestException('Email address not verified');
    }
    return user;
  }
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, userId: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
  async register(
    user: RegisterRequestDto,
    requestOrigin?: string,
  ): Promise<RegisterResponseDTO> {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (existingUser) {
      if (existingUser.emailVerified) {
        // Says "you already have an account" in the email, where only the
        // address owner can read it — never in the HTTP response.
        await this.mailService.send(
          buildAlreadyRegisteredMessage(existingUser.email),
        );
      } else {
        // Unverified: resend the link so they can finish signing up.
        await this.sendVerificationEmail(existingUser, requestOrigin);
      }

      // Either way the submitted password is ignored: honouring it would let
      // anyone who guesses an address overwrite the real owner's password.
      return { message: REGISTRATION_SUBMITTED_MESSAGE };
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = {
      ...user,
      firstName: '',
      lastName: '',
      username: user.email,
      password: hashedPassword,
    };

    const createdUser = await this.usersService.create(newUser);
    await this.sendVerificationEmail(createdUser, requestOrigin);
    return { message: REGISTRATION_SUBMITTED_MESSAGE };
  }
}
