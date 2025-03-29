import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserBodyDTO } from './dtos/registerUserBody.dto';
import { LoginUserBodyDTO } from './dtos/loginUserBody.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * This is a handler for POST /auth/register endpoint. It is responsible for registering
   * a new user in the API. It has request body validation and protection against duplicate
   * account creation built in. If this validation is passed, new user account is registered
   * and response confirming user registration is sent to the user. Otherwise, corresponding
   * error response is sent out.
   */
  @Post('register')
  async register(@Body() registerUserBody: RegisterUserBodyDTO) {
    await this.authService.registerUser(registerUserBody);
    return {
      message:
        'User has been successfully registered. Please login to recieve JWT Token.',
      user: {
        name: registerUserBody.name,
        email: registerUserBody.email,
        createdAt: new Date(Date.now()).toString(), // Genreates creation date and time of the user
      },
    };
  }

  /**
   * This is a handler for the POST /auth/login endpoint. It has request body validation built in and
   * authenticates user. If this validation is successfull, it returns generated JWT token for authorization,
   * which expires after seconds specified in JWT_TOKEN_EXPIRATION_SECONDS environment variable. Otherwise,
   * corresponding error response is sent out.
   */
  @Post('login')
  async login(@Body() loginUserBody: LoginUserBodyDTO) {
    return {
      message: `Successfully authenticated as ${loginUserBody.email}. Please keep this token as secret and do not show it anyone!`,
      jwt_token: await this.authService.authenticateUser(
        loginUserBody.email,
        loginUserBody.password,
      ),
      expirationDate: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
    };
  }
}
