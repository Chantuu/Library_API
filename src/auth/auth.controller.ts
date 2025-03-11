import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { RegisterUseBodyDTO } from './dtos/registerUserBody.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserBodyDTO } from './dtos/loginUserBody.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * This handler handles the incoming requests for the /auth/register endpoint.
   */
  @Post('register')
  async register(@Body() registerUserBody: RegisterUseBodyDTO) {
    const user = await this.usersService.findOneByEmail(registerUserBody.email);

    if (!user) {
      try {
        await this.usersService.createUser(registerUserBody);
        return {
          message: 'User has been successfully registered',
          user: {
            name: registerUserBody.name,
            email: registerUserBody.email,
            createdAt: new Date(Date.now()).toString(), // Genreates creation date and time of the user
          },
        };
      } catch {
        throw new InternalServerErrorException();
      }
    } else {
      throw new ConflictException('User with that email already exists');
    }
  }

  @Post('login')
  async login(@Body() loginUserBody: LoginUserBodyDTO) {
    return {
      message: `Successfully authenticated as ${loginUserBody.email}. Please keep this token as secret and do not show it anyone!`,
      jwt_token: await this.authService.authenticateUser(
        loginUserBody.email,
        loginUserBody.password,
      ),
      expirationDate: '240s',
    };
  }
}
