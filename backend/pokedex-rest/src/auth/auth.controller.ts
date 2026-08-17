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
import { LoginRequestDto } from './dtos/login-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';

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
}
