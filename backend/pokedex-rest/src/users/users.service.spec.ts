import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<UserEntity>>;

  const mockUser: UserEntity = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockUserData = {
    username: 'newuser',
    email: 'new@example.com',
    password: 'password123',
    firstName: 'New',
    lastName: 'User',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createdUser = { ...mockUser, ...mockUserData };

      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.create(mockUserData);

      expect(repository.create).toHaveBeenCalledWith(mockUserData);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should handle partial user data', async () => {
      const partialData = {
        username: 'partialuser',
        email: 'partial@example.com',
      };
      const createdUser = { ...mockUser, ...partialData };

      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.create(partialData);

      expect(repository.create).toHaveBeenCalledWith(partialData);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findOneByUsername', () => {
    it('should find user by username successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByUsername('testuser');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by username', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOneByUsername('nonexistent');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should find user by email successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should find user by id successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneById('user-123');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOneById('nonexistent-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = { firstName: 'Updated', lastName: 'Name' };
      const updatedUser = { ...mockUser, ...updateData };

      repository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      } as UpdateResult);
      repository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update('user-123', updateData);

      expect(repository.update).toHaveBeenCalledWith('user-123', updateData);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user not found for update', async () => {
      const updateData = { firstName: 'Updated' };

      repository.update.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      } as UpdateResult);
      repository.findOne.mockResolvedValue(null);

      const result = await service.update('nonexistent-id', updateData);

      expect(repository.update).toHaveBeenCalledWith(
        'nonexistent-id',
        updateData,
      );
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      repository.delete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      } as DeleteResult);

      const result = await service.delete('user-123');

      expect(repository.delete).toHaveBeenCalledWith('user-123');
      expect(result).toBe(true);
    });

    it('should return false when user not found for deletion', async () => {
      repository.delete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      } as DeleteResult);

      const result = await service.delete('nonexistent-id');

      expect(repository.delete).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBe(false);
    });

    it('should handle undefined affected value', async () => {
      repository.delete.mockResolvedValue({
        raw: [],
        generatedMaps: [],
      } as DeleteResult);

      const result = await service.delete('user-123');

      expect(repository.delete).toHaveBeenCalledWith('user-123');
      expect(result).toBe(false);
    });
  });
});
