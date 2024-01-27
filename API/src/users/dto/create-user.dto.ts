import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  public refreshToken?: string;
}
