import { serverRolesCoalition } from '@bella/data';
import { ServerListEnum } from '@bella/enums';
import { ServerRoles } from '@bella/types';

export const getDcByRole = (role: ServerRoles): ServerListEnum | undefined => {
  const keys = Object.keys(serverRolesCoalition);

  for (const server of keys)
    if (serverRolesCoalition[server].includes(role))
      return server as ServerListEnum;

  return undefined;
};
