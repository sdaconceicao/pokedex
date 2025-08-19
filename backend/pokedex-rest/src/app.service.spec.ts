import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UserEntity } from './users/users.entity';

describe('AppService', () => {
  let service: AppService;
  let usersService: jest.Mocked<UsersService>;

  const mockUser: UserEntity = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return hello message with user first name when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      usersService.findOneById.mockResolvedValue(mockUser);

      const result = await service.getHello(userId);

      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toBe('Hello Test!');
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = '987fcdeb-51a2-43d1-9f12-123456789abc';
      usersService.findOneById.mockResolvedValue(null);

      await expect(service.getHello(userId)).rejects.toThrow(
        new NotFoundException('User not found'),
      );

      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
    });

    it('should handle different user names correctly', async () => {
      const differentUser = { ...mockUser, firstName: 'John' };
      const userId = '456e7890-e89b-12d3-a456-426614174000';
      usersService.findOneById.mockResolvedValue(differentUser);

      const result = await service.getHello(userId);

      expect(usersService.findOneById).toHaveBeenCalledWith(userId);
      expect(result).toBe('Hello John!');
    });
  });
});
