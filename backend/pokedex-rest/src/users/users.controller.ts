import { Controller, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';

interface JwtUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends FastifyRequest {
  user: JwtUser;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(@Req() req: AuthenticatedRequest) {
    // Fetch the complete user data from the database using the ID from JWT
    const user = await this.usersService.findOneById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Return the complete user entity (excluding password) plus JWT fields
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: req.user.iat,
      exp: req.user.exp,
    };
  }
}
