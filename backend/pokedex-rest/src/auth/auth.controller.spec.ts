import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UserEntity } from '../users/users.entity';
import { AccessToken } from './types/AccessToken';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: UserEntity = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockRegisterDto: RegisterRequestDto = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
  };

  const mockAccessToken: AccessToken = {
    access_token: 'jwt-token-123',
  };

  const mockRequest = {
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with user from request', async () => {
      authService.login.mockResolvedValue(mockAccessToken);

      const result = await controller.login(mockRequest as any);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAccessToken);
    });

    it('should return the result from authService.login', async () => {
      const customToken: AccessToken = { access_token: 'custom-token' };
      authService.login.mockResolvedValue(customToken);

      const result = await controller.login(mockRequest as any);

      expect(result).toEqual(customToken);
    });
  });

  describe('register', () => {
    it('should call authService.register with register body', async () => {
      authService.register.mockResolvedValue(mockAccessToken);

      const result = await controller.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockAccessToken);
    });

    it('should return the result from authService.register', async () => {
      const customToken: AccessToken = { access_token: 'new-user-token' };
      authService.register.mockResolvedValue(customToken);

      const result = await controller.register(mockRegisterDto);

      expect(result).toEqual(customToken);
    });

    it('should handle async/await properly', async () => {
      authService.register.mockResolvedValue(mockAccessToken);

      const result = await controller.register(mockRegisterDto);

      expect(result).toEqual(mockAccessToken);
    });
  });
});
