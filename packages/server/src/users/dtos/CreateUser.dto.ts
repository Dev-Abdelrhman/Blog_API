import { IsNotEmpty, IsOptional, IsEmail, IsEnum } from 'class-validator';


export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  password!: string;
}
