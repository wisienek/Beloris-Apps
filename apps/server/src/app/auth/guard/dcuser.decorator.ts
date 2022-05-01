import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthService } from '../auth.service';

export const DcUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return AuthService.getTokenFromRequest(request);
  }
);
