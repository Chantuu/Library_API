import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class PatchUserBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @IsOptional()
  @ApiProperty({
    description: 'New name for specified user',
    example: 'Giorgi Chanturia',
    required: false,
  })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'New email for specified user',
    example: 'example@email.com',
    format: 'email',
    required: false,
  })
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ApiProperty({
    description: 'New password for specified user',
    example: 'SomePaswd1234!',
    required: false,
  })
  password?: string;
}
