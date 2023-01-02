import { ServerRoles } from '@bella/types';
import {
  ServerListEnum,
  DCAdminServerRoles,
  DCTestServerRoles,
} from '@bella/enums';

export const serverRolesCoalition: Record<
  ServerListEnum,
  Array<ServerRoles>
> = {
  [ServerListEnum.BELORIS]: [],
  [ServerListEnum.BELORIS_ADMIN]: [
    DCAdminServerRoles.MOD_MEISTER,
    DCAdminServerRoles.TECHNICIAN,
    DCAdminServerRoles.NARRATOR,
  ],
  [ServerListEnum.WOOLF_TEST]: [
    DCTestServerRoles.ADMIN,
    DCTestServerRoles.USER,
    DCTestServerRoles.MOD_MASTER,
  ],
};
