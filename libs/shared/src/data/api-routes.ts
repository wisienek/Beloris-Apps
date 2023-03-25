import { ServerListEnum } from '@bella/enums';
import { VersionType } from '@bella/types';

export class ApiRoutes {
  private static SERVER_URL = 'http://localhost:3333/api';

  // Version control
  public static VERSION = `${ApiRoutes.SERVER_URL}/uploader/version`;
  public static VERSION_HISTORY = `${ApiRoutes.SERVER_URL}/uploader/version/history`;
  public static UPDATE_VERSION = (version: VersionType) =>
    `${ApiRoutes.SERVER_URL}/uploader/version/${version.major}/${version.minor}`;

  // File List
  public static FILE_LIST = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/file-list`;
  public static FILE_LIST_UPLOAD = (v: VersionType, dataId: string) =>
    `${ApiRoutes.FILE_LIST(v.major, v.minor)}/${dataId}`;

  public static GET_UPDATE_FILES = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/update-files`;

  // Packages
  public static PACKAGE = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/package`;
  public static PACKAGE_UPLOAD = (major: number, minor: number, infoUUID: string) =>
    `${ApiRoutes.PACKAGE(major, minor)}/${infoUUID}`;
  public static PACKAGE_EDIT = (major: number, minor: number, infoUUID: string) =>
    `${ApiRoutes.PACKAGE(major, minor)}/${infoUUID}`;

  // User
  public static LOGIN = `${ApiRoutes.SERVER_URL}/auth/login`;
  public static USER = `${ApiRoutes.SERVER_URL}/auth/me`;
  public static MEMBER_Main = `${ApiRoutes.SERVER_URL}/auth/me/${ServerListEnum.BELORIS}`;
  public static MEMBER_ADMIN = `${ApiRoutes.SERVER_URL}/auth/me/${ServerListEnum.BELORIS_ADMIN}`;
  public static MEMBER_Main_ROLES = `${ApiRoutes.MEMBER_Main}/roles`;
  public static MEMBER_ADMIN_ROLES = `${ApiRoutes.MEMBER_ADMIN}/roles`;
  // test
  public static ROLES_TEST = `${ApiRoutes.SERVER_URL}/auth/test`;
}
