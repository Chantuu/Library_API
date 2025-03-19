import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostBookBodyDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  genre: string;

  @IsNumber()
  publishedYear: number;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  author: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  description?: string;
}
