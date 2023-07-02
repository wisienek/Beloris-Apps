import { VersionType } from '@bella/types';
import { UserSettings } from './user-settings.schema';
import {
  DownloaderFileDto,
  FileDialogInputDto,
  FileUploadDto,
  IpcEventDto,
  PackageDataDto,
  TokenDto,
  UploadPackageInfo,
  VersionDto,
} from '../dto';

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

  saveUserSettings: (data: Partial<UserSettings>) => Promise<IpcEventDto<boolean>>;
  settingsUpdatedEvent: (callback: Function) => void;
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
  openFileDialog: (data: FileDialogInputDto) => Promise<IpcEventDto<string | string[]>>;

  getDownloaderFiles: () => Promise<IpcEventDto<FileUploadDto[]>>;

  buildModpackPackage: (version: number) => Promise<IpcEventDto<PackageDataDto>>;

  uploadPackage: (
    version: VersionType,
    packageData: UploadPackageInfo,
    setCurrentVersion?: boolean
  ) => Promise<IpcEventDto<DownloaderFileDto>>;

  uploadFiles: (
    version: VersionType,
    filesData: Array<FileUploadDto>,
    setCurrentVersion?: boolean
  ) => Promise<IpcEventDto<DownloaderFileDto[]>>;

  uploadFilesListener: (callback: Function) => void;

  prepareDownloadFiles: (versions: VersionDto[]) => Promise<DownloaderFileDto[]>;

  downloadFiles: (files: DownloaderFileDto[], latestVersion: VersionDto) => Promise<void>;

  downloadFilesListener: (callback: Function) => void;
}

export interface WindowsApi {
  openLogin: (url: string) => Promise<void>;
  notify: (title: string, message: string) => Promise<IpcEventDto<boolean>>;
}

export interface WindowApi {
  app: WindowAppApi;
  settings: WindowSettingsApi;
  utilities: WindowUtilitiesApi;
  session: WindowSessionApi;
  files: WindowFilesApi;
  windows: WindowsApi;
}
