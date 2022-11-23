import {
  DownloaderFileDto,
  FileDialogInputDto,
  FileUploadDto,
  IpcEventDto,
  PackageDataDto,
  TokenDto,
  UploadPackageInfo,
} from '../dto';
import { UserSettings } from './user-settings.schema';
import { VersionType } from '@bella/types';

type Platform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd';

export interface WindowAppApi {
  getAppVersion: () => Promise<string>;
  platform: Platform;
}

export interface WindowSettingsApi {
  getUserSettings: () => Promise<IpcEventDto<UserSettings>>;

  saveUserSettings: (
    data: Partial<UserSettings>,
  ) => Promise<IpcEventDto<boolean>>;
}

export interface WindowUtilitiesApi {
  openExternalLink: (link: string) => Promise<IpcEventDto<boolean>>;
}

export interface WindowSessionApi {
  logout: () => Promise<IpcEventDto<boolean>>;
  getSession: () => Promise<IpcEventDto<TokenDto>>;
  receiveSession: (func: (...args: any) => void) => void;
}

export interface WindowFilesApi {
  openFileDialog: (
    data: FileDialogInputDto,
  ) => Promise<IpcEventDto<string | string[]>>;

  getDownloaderFiles: () => Promise<IpcEventDto<FileUploadDto[]>>;

  buildModpackPackage: (
    version: number,
  ) => Promise<IpcEventDto<PackageDataDto>>;

  uploadPackage: (
    version: VersionType,
    packageData: UploadPackageInfo,
  ) => Promise<IpcEventDto<DownloaderFileDto>>;

  uploadFiles: (
    version: VersionType,
    packageData: PackageDataDto,
  ) => Promise<IpcEventDto<DownloaderFileDto[]>>;
}

export interface WindowApi {
  app: WindowAppApi;
  settings: WindowSettingsApi;
  utilities: WindowUtilitiesApi;
  session: WindowSessionApi;
  files: WindowFilesApi;
}
