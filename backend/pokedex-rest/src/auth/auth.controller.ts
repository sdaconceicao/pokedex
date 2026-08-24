import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UserEntity } from '../users/users.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  EmailVerificationConfirmRequestDto,
  EmailVerificationConfirmResponseDTO,
} from './dtos/email-verification-confirm.dto';
import { EmailVerificationRequestDto } from './dtos/email-verification-request.dto';
import { EmailVerificationResponseDTO } from './dtos/email-verification-response.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { PasswordResetConfirmRequestDto } from './dtos/password-reset-confirm-request.dto';
import { PasswordResetConfirmResponseDTO } from './dtos/password-reset-confirm-response.dto';
import { PasswordResetRequestDto } from './dtos/password-reset-request.dto';
import { PasswordResetResponseDTO } from './dtos/password-reset-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { PasswordResetValidationPipe } from './validation/password-reset-validation.pipe';

export interface AuthenticatedRequest extends FastifyRequest {
  user: UserEntity;
}
@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({
    description: 'Successfully authenticated',
    type: LoginResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Unknown email or wrong password' })
  @ApiUnauthorizedResponse({ description: 'Missing credentials' })
  async login(
    @Request() req: AuthenticatedRequest,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }
  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiCreatedResponse({
    description: 'Account created and authenticated',
    type: RegisterResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Email already exists' })
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @Post('password-reset')
  @ApiOperation({ summary: 'Request a password reset link by email' })
  @ApiBody({ type: PasswordResetRequestDto })
  @ApiCreatedResponse({
    description:
      'Always succeeds with an identical message, whether or not the address is registered',
    type: PasswordResetResponseDTO,
  })
  async requestPasswordReset(
    @Body() body: PasswordResetRequestDto,
  ): Promise<PasswordResetResponseDTO> {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('password-reset/confirm')
  @ApiOperation({ summary: 'Set a new password using an emailed reset token' })
  @ApiBody({ type: PasswordResetConfirmRequestDto })
  @ApiCreatedResponse({
    description: 'Password updated and authenticated',
    type: PasswordResetConfirmResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token, or password failed validation',
  })
  async confirmPasswordReset(
    @Body(PasswordResetValidationPipe) body: PasswordResetConfirmRequestDto,
  ): Promise<PasswordResetConfirmResponseDTO> {
    return this.authService.confirmPasswordReset(body.token, body.password);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify an account using an emailed link' })
  @ApiBody({ type: EmailVerificationConfirmRequestDto })
  @ApiCreatedResponse({
    description: 'Account verified and authenticated',
    type: EmailVerificationConfirmResponseDTO,
  })
  @ApiBadRequestResponse({
    description: 'Invalid, expired, or already-used verification link',
  })
  async confirmEmailVerification(
    @Body() body: EmailVerificationConfirmRequestDto,
  ): Promise<EmailVerificationConfirmResponseDTO> {
    return this.authService.confirmEmailVerification(body.token);
  }

  @Post('verify-email/resend')
  @ApiOperation({ summary: 'Request a fresh verification link by email' })
  @ApiBody({ type: EmailVerificationRequestDto })
  @ApiCreatedResponse({
    description:
      'Always succeeds with an identical message, whether or not the address is registered or already verified',
    type: EmailVerificationResponseDTO,
  })
  async resendEmailVerification(
    @Body() body: EmailVerificationRequestDto,
  ): Promise<EmailVerificationResponseDTO> {
    return this.authService.resendEmailVerification(body.email);
  }
}
