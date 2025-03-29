import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

/**
 * This Guard is responsible for authorizing users in the API for uploading and managing
 * resources created by that user. This guard checks authorization header in request body
 * and tries verify it using JWT Module. If verification is successfull, user can access
 * that route. Otherwise, nest BadRequestException is thrown.
 *
 * NOTE: This Guard requires import of the UsersModule for it's functionality.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.get('Authorization') as string;

      // Extract user email from JWT token
      const payload = await this.jwtService.verifyAsync<{ userEmail: string }>(
        token,
        {
          secret: process.env.JWT_MODULE_SECRET,
        },
      );
      const foundUser = await this.usersService.findOneByEmail(
        payload.userEmail,
      );
      if (foundUser) {
        request['user'] = foundUser; // Save user information for route handlers
        return true;
      } else {
        return false;
      }
    } catch {
      throw new BadRequestException(
        'JWT Token has been expired or is invalid. Please log in again!',
      );
    }
  }
}
