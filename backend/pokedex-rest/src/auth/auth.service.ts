import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { AccessToken } from './types/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
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
    return user;
  }
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, userId: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      Logger.error(`Email already exists for user: ${user.email}`);
      throw new BadRequestException('email already exists');
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
    return this.login(createdUser);
  }
}
