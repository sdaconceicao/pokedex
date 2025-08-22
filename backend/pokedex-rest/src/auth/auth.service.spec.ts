import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/users.entity';
import { RegisterRequestDto } from './dtos/register-request.dto';

// Mock bcrypt module
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: UserEntity = {
    id: 'user-123',
    username: 'test@example.com',
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: '',
    lastName: '',
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
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should validate user successfully with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await service.validateUser(email, password);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
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
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

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
      const mockToken = 'jwt-token-123';
      const createdUser = {
        ...mockUser,
        ...mockRegisterDto,
        password: hashedPassword,
      };

      usersService.findOneByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersService.create.mockResolvedValue(createdUser);
      jwtService.signAsync.mockResolvedValue(mockToken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: createdUser.email,
        userId: createdUser.id,
      });
      expect(result).toEqual({ access_token: mockToken });
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
});
