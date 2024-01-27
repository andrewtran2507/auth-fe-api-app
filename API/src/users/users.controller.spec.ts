import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  mockDeleteUser,
  mockUser,
  mockUserService,
} from './users.service.spec';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new user', async () => {
    expect.assertions(1);
    const input: CreateUserDto = {
      username: 'user1234',
      password: 'user1234',
      email: 'user1234@gmail.com',
    };
    const result = await controller.create(input);
    expect(result).toEqual(mockUser);
  });

  it('should find all users', async () => {
    expect.assertions(1);
    const result = await controller.findAll();
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining(mockUser)]),
    );
  });

  it('should find user by id', async () => {
    expect.assertions(1);
    const result = await controller.findById(
      '456b11d8-145c-4ab6-b650-70006b2994c6',
    );
    expect(result.id).toEqual('456b11d8-145c-4ab6-b650-70006b2994c6');
  });

  it('should update a user', async () => {
    expect.assertions(1);
    const data = {
      username: 'user1234',
    };
    const result = await controller.update(
      '456b11d8-145c-4ab6-b650-70006b2994c6',
      data,
    );
    expect(result.username).toEqual('user1234');
  });

  it('should delete a user', async () => {
    expect.assertions(1);
    const result = await controller.remove(
      '456b11d8-145c-4ab6-b650-70006b2994c6',
    );
    expect(result).toEqual(mockDeleteUser);
  });
});
