import { IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsOptional()
  name?: string;
}
