import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { sortRolesForServers } from '@bella/utils';
import { ServerListEnum } from '@bella/enums';
import { ServerRoles } from '@bella/types';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ServerRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles?.length === 0) return true;

    try {
      const resolvedServers = sortRolesForServers(requiredRoles);
      const servers = Object.keys(resolvedServers) as ServerListEnum[];

      for (const server of servers) {
        const member = await this.authService.fetchMember(
          AuthService.getTokenFromRequest(context.switchToHttp().getRequest()),
          server,
        );

        for (const role of resolvedServers[server])
          if (!member?.roles?.includes(role)) return false;
      }
    } catch (error) {
      this.logger.error(error);
      return false;
    }

    return true;
  }
}
