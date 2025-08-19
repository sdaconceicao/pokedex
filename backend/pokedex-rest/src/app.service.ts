import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UserEntity } from './users/users.entity';
import { UUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}
  async getHello(userId: UUID): Promise<string> {
    const user: UserEntity | null = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return `Hello ${user.firstName}!`;
  }
}
