import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import type { Mocked } from 'vitest';
import { MailService } from '../mail/mail.service';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dtos/register-request.dto';

// Mock bcrypt module
vi.mock('bcrypt', () => ({
  compareSync: vi.fn(),
  hash: vi.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Mocked<UsersService>;
  let jwtService: Mocked<JwtService>;
  let configService: Mocked<ConfigService>;
  let mailService: Mocked<MailService>;

  const mockUser: UserEntity = {
    id: 'user-123',
    username: 'test@example.com',
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: '',
    lastName: '',
    emailVerified: true,
  };

  const mockRegisterDto: RegisterRequestDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: vi.fn(),
            create: vi.fn(),
            findOneById: vi.fn(),
            update: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn(),
            verifyAsync: vi.fn(),
            decode: vi.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn(),
            get: vi.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            send: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    mailService = module.get(MailService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should validate user successfully with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findOneByEmail.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compareSync).mockReturnValue(true);

      const result = await service.validateUser(email, password);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('rejects a verified-credentials login when the email is unverified', async () => {
      usersService.findOneByEmail.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });
      vi.mocked(bcrypt.compareSync).mockReturnValue(true);

      await expect(
        service.validateUser('test@example.com', 'password123'),
      ).rejects.toThrow(new BadRequestException('Email address not verified'));
    });

    it('reports a password failure before an unverified failure', async () => {
      usersService.findOneByEmail.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });
      vi.mocked(bcrypt.compareSync).mockReturnValue(false);

      // Order matters: leading with "not verified" would confirm the address
      // is registered to anyone guessing passwords.
      await expect(
        service.validateUser('test@example.com', 'wrong'),
      ).rejects.toThrow(new BadRequestException('Password does not match'));
    });

    it('should throw BadRequestException when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      usersService.findOneByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new BadRequestException('User not found'),
      );

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw BadRequestException when password does not match', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersService.findOneByEmail.mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compareSync).mockReturnValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new BadRequestException('Password does not match'),
      );

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
    });
  });

  describe('login', () => {
    it('should generate access token for valid user', async () => {
      const mockToken = 'jwt-token-123';
      const expectedPayload = { email: mockUser.email, userId: mockUser.id };

      jwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        ...mockUser,
        ...mockRegisterDto,
        password: hashedPassword,
        emailVerified: false,
      };

      usersService.findOneByEmail.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
      usersService.create.mockResolvedValue(createdUser);
      jwtService.signAsync.mockResolvedValue('verify-token-123');
      mailService.send.mockResolvedValue({ ok: true, id: 'resend-1' });
      configService.getOrThrow.mockImplementation(
        (key: string) =>
          ({
            JWT_SECRET: 'test-secret',
            FRONTEND_BASE_URL: 'http://localhost:3010',
          })[key] as never,
      );
      configService.get.mockReturnValue('86400' as never);

      const result = await service.register(mockRegisterDto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...mockRegisterDto,
        username: mockRegisterDto.email,
        firstName: '',
        lastName: '',
        password: hashedPassword,
      });
      // Keyed on email + the row's unverified state, so using the link
      // invalidates it.
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { userId: createdUser.id },
        {
          secret: `test-secret${createdUser.email}false`,
          expiresIn: 86400,
        },
      );
      expect(mailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: createdUser.email,
          html: expect.stringContaining(
            'http://localhost:3010/verify-email?token=verify-token-123',
          ),
        }),
      );
      // No token: the account cannot sign in yet.
      expect(result).toEqual({
        message: 'Check your email for a link to verify your account',
      });
    });

    it('should throw BadRequestException when email already exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        new BadRequestException('email already exists'),
      );

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    const GENERIC_MESSAGE = {
      message:
        'If an account exists for that address, a reset link has been sent',
    };

    beforeEach(() => {
      configService.getOrThrow.mockImplementation(
        (key: string) =>
          ({
            JWT_SECRET: 'test-secret',
            FRONTEND_BASE_URL: 'http://localhost:3010',
          })[key] as never,
      );
      configService.get.mockReturnValue('900' as never);
    });

    it('falls back to a 15 minute expiry when the TTL is unset', async () => {
      configService.get.mockReturnValue(undefined as never);
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('reset-token-123');
      mailService.send.mockResolvedValue({ ok: true, id: 'resend-1' });

      const result = await service.requestPasswordReset(mockUser.email);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { userId: mockUser.id },
        { secret: `test-secret${mockUser.password}`, expiresIn: 900 },
      );
      expect(result).toEqual(GENERIC_MESSAGE);
    });

    it('signs a token against the current hash and mails the link', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('reset-token-123');
      mailService.send.mockResolvedValue({ ok: true, id: 'resend-1' });

      const result = await service.requestPasswordReset(mockUser.email);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { userId: mockUser.id },
        { secret: `test-secret${mockUser.password}`, expiresIn: 900 },
      );
      expect(mailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockUser.email,
          html: expect.stringContaining(
            'http://localhost:3010/reset-password?token=reset-token-123',
          ),
        }),
      );
      expect(result).toEqual(GENERIC_MESSAGE);
    });

    it('returns the same message and sends nothing for an unknown address', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.requestPasswordReset('nobody@example.com');

      expect(mailService.send).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(result).toEqual(GENERIC_MESSAGE);
    });

    it('returns the same message when the send fails', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('reset-token-123');
      mailService.send.mockResolvedValue({ ok: false, error: 'mail disabled' });

      const result = await service.requestPasswordReset(mockUser.email);

      expect(result).toEqual(GENERIC_MESSAGE);
    });
  });

  describe('confirmPasswordReset', () => {
    const INVALID_TOKEN = new BadRequestException(
      'Invalid or expired reset token',
    );

    beforeEach(() => {
      configService.getOrThrow.mockReturnValue('test-secret' as never);
    });

    it('verifies against the current hash, then rotates the password', async () => {
      jwtService.decode.mockReturnValue({ userId: mockUser.id });
      usersService.findOneById.mockResolvedValue(mockUser);
      jwtService.verifyAsync.mockResolvedValue({ userId: mockUser.id });
      vi.mocked(bcrypt.hash).mockResolvedValue('newHash' as never);
      usersService.update.mockResolvedValue({
        ...mockUser,
        password: 'newHash',
      });
      jwtService.signAsync.mockResolvedValue('access-token-123');

      const result = await service.confirmPasswordReset(
        'reset-token-123',
        'Pikachu123!',
      );

      // Secret is built from the hash as it was *before* the rotation.
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('reset-token-123', {
        secret: `test-secret${mockUser.password}`,
      });
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, {
        password: 'newHash',
        // Reset doubles as verification — see confirmPasswordReset.
        emailVerified: true,
      });
      expect(result).toEqual({ access_token: 'access-token-123' });
    });

    it('rejects a malformed token without touching the database', async () => {
      jwtService.decode.mockReturnValue(null);

      await expect(
        service.confirmPasswordReset('garbage', 'Pikachu123!'),
      ).rejects.toThrow(INVALID_TOKEN);
      expect(usersService.findOneById).not.toHaveBeenCalled();
    });

    it('rejects a token naming an unknown user with the same error', async () => {
      jwtService.decode.mockReturnValue({ userId: 'ghost-123' });
      usersService.findOneById.mockResolvedValue(null);

      await expect(
        service.confirmPasswordReset('reset-token-123', 'Pikachu123!'),
      ).rejects.toThrow(INVALID_TOKEN);
    });

    it('rejects an expired, tampered, or already-spent token', async () => {
      jwtService.decode.mockReturnValue({ userId: mockUser.id });
      usersService.findOneById.mockResolvedValue(mockUser);
      jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(
        service.confirmPasswordReset('reset-token-123', 'Pikachu123!'),
      ).rejects.toThrow(INVALID_TOKEN);
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('rejects when the password write reports no row updated', async () => {
      jwtService.decode.mockReturnValue({ userId: mockUser.id });
      usersService.findOneById.mockResolvedValue(mockUser);
      jwtService.verifyAsync.mockResolvedValue({ userId: mockUser.id });
      vi.mocked(bcrypt.hash).mockResolvedValue('newHash' as never);
      usersService.update.mockResolvedValue(null);

      await expect(
        service.confirmPasswordReset('reset-token-123', 'Pikachu123!'),
      ).rejects.toThrow(INVALID_TOKEN);
    });
  });

  describe('confirmEmailVerification', () => {
    const INVALID_LINK = new BadRequestException(
      'Invalid or expired verification link',
    );
    const unverified = { ...mockUser, emailVerified: false };

    beforeEach(() => {
      configService.getOrThrow.mockReturnValue('test-secret' as never);
    });

    it('flips the flag against the unverified key, then signs the user in', async () => {
      jwtService.decode.mockReturnValue({ userId: unverified.id });
      usersService.findOneById.mockResolvedValue(unverified);
      jwtService.verifyAsync.mockResolvedValue({ userId: unverified.id });
      usersService.update.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('access-token-123');

      const result = await service.confirmEmailVerification('verify-token-123');

      // Key embeds the pre-verification state, which is why reuse fails.
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('verify-token-123', {
        secret: `test-secret${unverified.email}false`,
      });
      expect(usersService.update).toHaveBeenCalledWith(unverified.id, {
        emailVerified: true,
      });
      expect(result).toEqual({ access_token: 'access-token-123' });
    });

    it('rejects a malformed link without touching the database', async () => {
      jwtService.decode.mockReturnValue(null);

      await expect(service.confirmEmailVerification('garbage')).rejects.toThrow(
        INVALID_LINK,
      );
      expect(usersService.findOneById).not.toHaveBeenCalled();
    });

    it('rejects a reused link with the same error', async () => {
      // Already verified, so the key no longer matches what signed the token.
      jwtService.decode.mockReturnValue({ userId: mockUser.id });
      usersService.findOneById.mockResolvedValue(mockUser);
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));

      await expect(
        service.confirmEmailVerification('verify-token-123'),
      ).rejects.toThrow(INVALID_LINK);
      expect(usersService.update).not.toHaveBeenCalled();
    });
  });

  describe('resendEmailVerification', () => {
    const RESENT_MESSAGE = {
      message:
        'If an unverified account exists for that address, a new link has been sent',
    };

    beforeEach(() => {
      configService.getOrThrow.mockImplementation(
        (key: string) =>
          ({
            JWT_SECRET: 'test-secret',
            FRONTEND_BASE_URL: 'http://localhost:3010',
          })[key] as never,
      );
      configService.get.mockReturnValue('86400' as never);
    });

    it('sends a fresh link to an unverified account', async () => {
      usersService.findOneByEmail.mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      });
      jwtService.signAsync.mockResolvedValue('verify-token-456');
      mailService.send.mockResolvedValue({ ok: true, id: 'resend-1' });

      const result = await service.resendEmailVerification(mockUser.email);

      expect(mailService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockUser.email,
          html: expect.stringContaining(
            'http://localhost:3010/verify-email?token=verify-token-456',
          ),
        }),
      );
      expect(result).toEqual(RESENT_MESSAGE);
    });

    it('sends nothing for an already-verified account but replies the same', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);

      const result = await service.resendEmailVerification(mockUser.email);

      expect(mailService.send).not.toHaveBeenCalled();
      expect(result).toEqual(RESENT_MESSAGE);
    });

    it('sends nothing for an unknown address but replies the same', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      const result =
        await service.resendEmailVerification('nobody@example.com');

      expect(mailService.send).not.toHaveBeenCalled();
      expect(result).toEqual(RESENT_MESSAGE);
    });
  });
});
