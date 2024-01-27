import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashData } from '../common/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (user) {
      delete user.password;
      return user;
    }
    throw new HttpException(
      'The user ID you entered does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (user) {
      delete user.password;
      return user;
    }
    throw new HttpException(
      'The username you entered does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      return user;
    }
    // throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const currentUser = await this.findById(id);
    if (currentUser && updateUserDto.password) {
      updateUserDto.password = await hashData(updateUserDto.password);
    }
    await this.usersRepository.save({
      id,
      username: updateUserDto.username,
      password: updateUserDto.password,
      refreshToken: updateUserDto.refreshToken,
    });
    const user = await this.findById(id);
    return user;
  }

  async remove(id: string) {
    return this.usersRepository.softDelete(id);
  }
}
