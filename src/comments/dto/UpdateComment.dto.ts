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
  @IsInt()
  parentId?: number;
}
