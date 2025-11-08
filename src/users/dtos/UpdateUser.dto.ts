import { IsEmail, IsOptional, IsEnum } from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['reader', 'author'])
  @IsOptional()
  role?: string;

  @IsOptional()
  name?: string;
}
