import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

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
