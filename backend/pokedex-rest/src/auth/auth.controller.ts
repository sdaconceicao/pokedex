import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { RegisterRequestDto } from './dtos/register-request.dto';
import type { LoginResponseDTO } from './dtos/login-response.dto';
import type { RegisterResponseDTO } from './dtos/register-response.dto';
import { FastifyRequest } from 'fastify';
import { UserEntity } from '../users/users.entity';

interface AuthenticatedRequest extends FastifyRequest {
  user: UserEntity;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: AuthenticatedRequest,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }
}
