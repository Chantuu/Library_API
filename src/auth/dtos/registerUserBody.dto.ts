import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUseBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
