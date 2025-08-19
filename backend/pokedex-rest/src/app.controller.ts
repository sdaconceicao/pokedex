import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './auth/decorators/user.decorator';
import { UserEntity } from './users/users.entity';
import { UUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@User() user: UserEntity): Promise<string> {
    return await this.appService.getHello(user.id as UUID);
  }
}
