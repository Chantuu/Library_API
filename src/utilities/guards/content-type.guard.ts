import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { onlyApplicationJsonErrorMessage } from '../messages/errorMessages.file';

/**
 * This is very simple guard, which guards desired endpoints against unwanted
 * content type requests and allows only application/json type requests.
 */
@Injectable()
export class ContentTypeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // If incoming request's content type is application/json
    if (request.headers['content-type'] === 'application/json') {
      return true;
    } else {
      throw new BadRequestException(onlyApplicationJsonErrorMessage);
    }
  }
}
