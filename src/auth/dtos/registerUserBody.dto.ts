import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({
    description: 'Name of the new user',
    example: 'Giorgi Chanturia',
    minLength: 3,
    maxLength: 32,
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email of the new user',
    example: 'example@email.com',
    pattern: 'email',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Password of the new user',
    example: 'SomePaswd1234!',
    minLength: 8,
  })
  password: string;
}
