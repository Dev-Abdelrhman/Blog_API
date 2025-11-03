import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsEnum(['light', 'dark'])
  @IsOptional()
  theme?: 'light' | 'dark';

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;
}
