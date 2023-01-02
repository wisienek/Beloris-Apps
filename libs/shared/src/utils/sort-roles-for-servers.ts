import { ServerRoles } from '@bella/types';
import { ServerListEnum } from '@bella/enums';
import { getDcByRole } from './dc-server-by-role.resolver';

export const sortRolesForServers: (
  roles: ServerRoles[],
) => Partial<Record<ServerListEnum, Array<ServerRoles>>> = (roles) => {
  const data = {};

  for (const role of roles) {
    const server = getDcByRole(role);
    if (!server) throw new Error(`No server for ${role}`);

    data[server] = (data[server] ?? []).push(role);
  }

  return data;
};
