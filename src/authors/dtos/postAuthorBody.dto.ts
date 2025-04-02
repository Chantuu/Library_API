import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostAuthorBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'Name of the author',
    example: 'Mark Twain',
    minLength: 3,
    maxLength: 20,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Biography of the author',
  })
  biography?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Birth date of the author',
    example: '1835-12-30T12:00:00z',
    format: 'ISO8601',
  })
  birthDate?: string;
}
