import { IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEnum(['reader', 'author'])
  @IsOptional()
  role?: string;

  @IsNotEmpty()
  password: string;
}
