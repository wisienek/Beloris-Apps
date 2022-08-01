export class ApiRoutes {
  private static SERVER_URL = 'http://localhost:3333/api';

  // Version control
  public static VERSION = `${ApiRoutes.SERVER_URL}/uploader/version`;
  public static VERSION_HISTORY = `${ApiRoutes.SERVER_URL}/uploader/version/history`;

  // File List
  public static FILE_LIST = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/file-list`;
  public static FILE_LIST_UPLOAD = (major: number, minor: number) =>
    `${ApiRoutes.FILE_LIST(major, minor)}/file`;

  public static GET_UPDATE_FILES = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/update-files`;

  // Packages
  public static PACKAGE = (major: number, minor: number) =>
    `${ApiRoutes.SERVER_URL}/uploader/${major}/${minor}/package`;
  public static PACKAGE_UPLOAD = (major: number, minor: number) =>
    `${ApiRoutes.PACKAGE(major, minor)}/file`;

  // User
  public static LOGIN = `${ApiRoutes.SERVER_URL}/auth/login`;
  public static ME = `${ApiRoutes.SERVER_URL}/auth/me`;
}
