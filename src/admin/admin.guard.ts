import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

/**
 * This Guard is responsible for protecting routes used by admin user. It checks, that current user,
 * which is attached to the request body. If that user is admin, this Guard grants access to the
 * protected route. Otherwise, it throws nest ForbiddenException.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request['user'];

    if (user.role === 'admin') {
      return true;
    } else {
      throw new ForbiddenException(
        "You are unauthorized to access this endpoint. It's restricted only to the Admins.",
      );
    }
  }
}
