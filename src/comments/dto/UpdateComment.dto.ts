import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['love', 'like', 'care'])
  react?: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
