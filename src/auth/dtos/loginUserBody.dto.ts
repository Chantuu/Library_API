import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserBodyDTO {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the desired user',
    example: 'example@email.com',
    pattern: 'email',
    required: false,
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Password of the desired user',
    example: 'SomePaswd1234!',
    minLength: 8,
    required: false,
  })
  password: string;
}
