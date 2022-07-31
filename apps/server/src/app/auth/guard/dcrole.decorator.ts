import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ServerListEnum } from '@bella/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const inServer = this.reflector.getAllAndOverride<ServerListEnum>(
      'server',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || !inServer) return true;

    const member = await this.authService.fetchMember(
      AuthService.getTokenFromRequest(context.switchToHttp().getRequest()),
      inServer
    );
    return requiredRoles.some((role) => member?.roles?.includes(role));
  }
}
