import { Controller, Get, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';
import { UserResponseDto } from './dtos/user-response.dto';

interface JwtUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends FastifyRequest {
  user: JwtUser;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({
    description: 'Profile of the authenticated user',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  async getUser(@Req() req: AuthenticatedRequest): Promise<UserResponseDto> {
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
