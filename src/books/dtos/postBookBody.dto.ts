import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Title of the book',
    example: 'The Adventures of Tom Sawyer',
    minLength: 4,
    maxLength: 32,
  })
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    description: 'Genre of the book',
    example: 'Novel',
    minLength: 4,
    maxLength: 20,
  })
  genre: string;

  @IsNumber()
  @ApiProperty({
    description: 'Publish year of the book',
    example: '1876',
  })
  publishedYear: number;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @ApiProperty({
    description: 'Author of the book',
    example: 'Mark Twain',
    minLength: 4,
    maxLength: 32,
  })
  author: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiPropertyOptional({
    description: 'description of the book',
    minLength: 6,
  })
  description?: string;
}
