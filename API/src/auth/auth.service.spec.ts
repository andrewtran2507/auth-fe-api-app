/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockUser, mockUserService } from 'src/users/users.service.spec';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export const mockToken = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
};
export const mockAuthService = {
  signUp: jest.fn((data: CreateUserDto) => {
    if (data.email !== 'emailexist@gmail.com') {
      return mockToken;
    }
    throw new BadRequestException('User already exists');
  }),
  logIn: jest.fn((data: LoginDto) => {
    if (data.email === 'emailexist@gmail.com') {
      throw new BadRequestException('User does not exist');
    } else if (data.password === 'wrongpassword') {
      throw new BadRequestException('Password is incorrect');
    } else {
      return mockUser;
    }
  }),
  logout: jest.fn((_userId: string) => {}),
  refreshTokens: jest.fn((userId: string, refreshToken: string) => {
    if (userId === '12345') {
      throw new ForbiddenException('Access Denied');
    } else if (refreshToken === '') {
      throw new ForbiddenException('Access Denied');
    } else {
      return mockToken;
    }
  }),
  updateRefreshToken: jest.fn((_userId: string, _refreshToken: string) => {}),
  getTokens: jest.fn((_userId: string, _refreshToken: string) => {
    console.log('should return mockToken');
    return mockToken;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      imports: [JwtModule, ConfigModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    console.log('first');
    expect(service).toBeDefined();
  });

  it('should sign up user', async () => {
    const input: CreateUserDto = {
      username: 'user1234',
      password: 'user1234',
      email: 'emailnotexist@gmail.com',
    };
    const result = await service.signUp(input);
    expect(result).toEqual(mockToken);
  });

  it('should fail to sign up user', async () => {
    const input: CreateUserDto = {
      username: 'user1234',
      password: 'user1234',
      email: 'user1234@gmail.com',
    };
    try {
      await service.signUp(input);
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should login user successfully', async () => {
    const input: LoginDto = {
      password: 'user1234',
      email: 'user1234@gmail.com',
    };
    const result = await service.logIn(input);
    expect(result).toEqual(mockUser);
  });

  it('should login user unsuccessfully due to non-existing email', async () => {
    const input: LoginDto = {
      password: 'user1234',
      email: 'emailexist@gmail.com',
    };
    try {
      await service.logIn(input);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should login user unsuccessfully due to wrong password', async () => {
    const input: LoginDto = {
      password: 'wrongpassword',
      email: 'user1234@gmail.com',
    };
    try {
      await service.logIn(input);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should login out', async () => {
    const userId = '456b11d8-145c-4ab6-b650-70006b2994c6';
    const result = await service.logout(userId);
    expect(() => {
      result;
    }).not.toThrow();
  });

  it('should refreshTokens successfully', async () => {
    const input = {
      userId: '456b11d8-145c-4ab6-b650-70006b2994c6',
      refreshToken: 'refreshToken',
    };
    const result = await service.refreshTokens(
      input.userId,
      input.refreshToken,
    );
    expect(() => {
      result;
    }).not.toThrow();
  });

  it('should get Tokens', async () => {
    const input = {
      userId: '456b11d8-145c-4ab6-b650-70006b2994c6',
      email: 'emailexist@gmail.com',
    };
    const result = await service.getTokens(input.userId, input.email);
    expect(result).toEqual(mockToken);
  });
});
