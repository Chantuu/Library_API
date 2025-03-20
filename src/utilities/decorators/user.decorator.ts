import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * This decorator is used to extract user entity from the request body.
 * It must be used after AuthGuard to properly extract and return an user.
 */
export const GetUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); // Get full request
    return request.user;
  },
);
