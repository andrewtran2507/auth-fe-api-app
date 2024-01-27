import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockAuthService, mockToken } from './auth.service.spec';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { mockUser } from 'src/users/users.service.spec';
import { LoginDto } from 'src/users/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up user', async () => {
    const input: CreateUserDto = {
      username: 'user1234',
      password: 'user1234',
      email: 'emailnotexist@gmail.com',
    };
    const result = await controller.signup(input);
    expect(result).toEqual(mockToken);
  });

  it('should login user successfully', async () => {
    const input: LoginDto = {
      password: 'user1234',
      email: 'user1234@gmail.com',
    };
    const result = await controller.login(input);
    expect(result).toEqual(mockUser);
  });

  it('should login out', async () => {
    const req = {
      user: {
        sub: '456b11d8-145c-4ab6-b650-70006b2994c6',
      },
    } as any;
    const result = await jest.spyOn(controller, 'logout');
    controller.logout(req);
    expect(result).toHaveBeenCalled();
  });

  it('should refresh', async () => {
    const req = {
      user: {
        sub: '456b11d8-145c-4ab6-b650-70006b2994c6',
        refreshToken: 'refreshToken',
      },
    } as any;
    const result = await controller.refreshTokens(req);
    expect(result).toEqual(mockToken);
  });
});
