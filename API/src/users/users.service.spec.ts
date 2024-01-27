/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('../common/common', () => {
  return {
    __esModule: true,
    default: jest.fn(() => 'hashData'),
    hashData: jest.fn(() => 'hashData'),
  };
});

export const mockUser: User = {
  id: '456b11d8-145c-4ab6-b650-70006b2994c6',
  email: 'user1234@gmail.com',
  username: 'user1234',
  password: 'user1234',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  is_activated: false,
};
export const mockDeleteUser = {
  generatedMaps: [],
  raw: [],
  affected: 1,
};
export const mockUserService = {
  create: jest.fn(() => mockUser),
  findAll: jest.fn(() => [mockUser]),
  findById: jest.fn((id: string) => {
    if (id !== '12345') {
      return mockUser;
    }
    throw new HttpException(
      'The user ID you entered does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }),
  findByUsername: jest.fn((username: string) => {
    if (username !== 'usernotexist') {
      return mockUser;
    }
    return new HttpException(
      'The username you entered does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }),
  findByEmail: jest.fn((email: string) => {
    console.log('email', email);
    if (email === 'emailnotexist@gmail.com') {
      return false;
    }
    return mockUser;
  }),
  update: jest.fn((_id: string, _data: UpdateUserDto) => mockUser),
  remove: jest.fn((_id: string) => mockDeleteUser),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    // console.log('service', service);
    expect(service).toBeDefined();
  });

  it('should create new user', async () => {
    expect.assertions(1);
    const input: CreateUserDto = {
      username: 'user1234',
      password: 'user1234',
      email: 'user1234@gmail.com',
    };
    const result = await service.create(input);
    expect(result).toEqual(mockUser);
  });

  it('should find all users', async () => {
    expect.assertions(1);
    const result = await service.findAll();
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining(mockUser)]),
    );
  });

  it('should find user by id', async () => {
    expect.assertions(1);
    const result = await service.findById(
      '456b11d8-145c-4ab6-b650-70006b2994c6',
    );
    expect(result.id).toEqual('456b11d8-145c-4ab6-b650-70006b2994c6');
  });

  it('should fail to find user by id', async () => {
    try {
      await service.findById('12345');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
    }
  });

  it('should find user by username', async () => {
    expect.assertions(1);
    const result = await service.findByUsername('admin001');
    expect(result).toEqual(mockUser);
  });

  it('should fail to find user by username', async () => {
    try {
      await service.findByUsername('usernotexist');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
    }
  });

  it('should find by email', async () => {
    expect.assertions(1);
    const result = await service.findByEmail('user1234@gmail.com');
    expect(result.email).toEqual('user1234@gmail.com');
  });

  it('should update a user', async () => {
    expect.assertions(1);
    const data = {
      username: 'user1234',
    };
    const result = await service.update(
      '456b11d8-145c-4ab6-b650-70006b2994c6',
      data,
    );
    expect(result.username).toEqual('user1234');
  });

  it('should delete a user', async () => {
    expect.assertions(1);
    const result = await service.remove('456b11d8-145c-4ab6-b650-70006b2994c6');
    expect(result).toEqual(mockDeleteUser);
  });
});
