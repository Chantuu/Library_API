import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterUserBodyDTO } from './dtos/registerUserBody.dto';
import { LoginUserBodyDTO } from './dtos/loginUserBody.dto';
import { AuthService } from './auth.service';
import { userRegisteredSuccessMessage } from 'src/utilities/messages/successMessages.file';
import { ContentTypeGuard } from 'src/utilities/guards/content-type.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
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
  @ApiOperation({
    description: 'This endpoint registers new user in the API.',
  })
  @ApiCreatedResponse({
    description: 'User registration is successfull',
    example: {
      message: userRegisteredSuccessMessage,
      user: {
        name: 'Giorgi Chanturia',
        email: 'example@email.com',
        createdAt: new Date(Date.now()).toString(),
      },
    },
  })
  @ApiConflictResponse({
    description: 'User with provided email already exists',
  })
  @ApiBadRequestResponse({
    description: 'The endpoint was provided with bad request body',
  })
  @Post('register')
  @UseGuards(ContentTypeGuard)
  async register(@Body() registerUserBody: RegisterUserBodyDTO) {
    await this.authService.registerUser(registerUserBody);
    return {
      message: userRegisteredSuccessMessage,
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
  @ApiOperation({
    description:
      'This endpoint authenticates user with credentials provided in request body and returns JWT Token if authenticated.',
  })
  @ApiOkResponse({
    description: 'User authentication is successfull',
    example: {
      message:
        'Successfully authenticated as some@email.com. Please, keep this token as secret and do not show it anyone!',
      jwt_token: 'Generic JWT Token',
      expirationDate: '400s',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Incorrect credentials were provided in the request body',
  })
  @ApiBadRequestResponse({
    description: 'The endpoint was provided with bad request body',
  })
  @Post('login')
  @UseGuards(ContentTypeGuard)
  async login(@Body() loginUserBody: LoginUserBodyDTO) {
    return {
      message: `Successfully authenticated as ${loginUserBody.email}. Please, keep this token as secret and do not show it anyone!`,
      jwt_token: await this.authService.authenticateUser(
        loginUserBody.email,
        loginUserBody.password,
      ),
      expirationDate: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
    };
  }
}
