import {
  DCAdminServerRoles,
  DCMainServerRoles,
  DCTestServerRoles,
} from '@bella/enums';

export type ServerRoles =
  | DCAdminServerRoles
  | DCTestServerRoles
  | DCMainServerRoles;
