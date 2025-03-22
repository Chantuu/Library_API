import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PatchBookBodyDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  genre?: string;

  @IsNumber()
  @IsOptional()
  publishedYear?: number;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @IsOptional()
  description?: string;
}
