import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    description: 'Title of the book',
    example: 'The Adventures of Tom Sawyer',
    minLength: 4,
    maxLength: 32,
  })
  title?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Genre of the book',
    example: 'Novel',
    minLength: 4,
    maxLength: 20,
  })
  genre?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Publish year of the book',
    example: '1876',
  })
  publishedYear?: number;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Author of the book',
    example: 'Mark Twain',
    minLength: 4,
    maxLength: 32,
  })
  author?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'description of the book',
    minLength: 6,
  })
  description?: string;
}
