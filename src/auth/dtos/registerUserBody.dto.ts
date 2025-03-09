import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { RegisterUserBodyInterface } from 'src/utilities/interfaces/registerUserBody.interface';

export class RegisterUseBodyDTO implements RegisterUserBodyInterface {
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
