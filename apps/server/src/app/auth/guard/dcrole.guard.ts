import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { sortRolesForServers } from '@bella/utils';
import { ServerListEnum } from '@bella/enums';
import { ServerRoles } from '@bella/types';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ServerRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles?.length === 0) return true;

    const resolvedServers = sortRolesForServers(requiredRoles);
    const servers = Object.keys(resolvedServers) as ServerListEnum[];

    console.log(resolvedServers, requiredRoles);

    for (const server of servers) {
      const member = await this.authService.fetchMember(
        AuthService.getTokenFromRequest(context.switchToHttp().getRequest()),
        server,
      );

      for (const role of resolvedServers[server])
        if (!member?.roles?.includes(role)) return false;
    }

    return true;
  }
}
