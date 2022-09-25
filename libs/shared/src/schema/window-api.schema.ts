import {
  FileDialogInputDto,
  FileUploadDto,
  IpcEventDto,
  TokenDto,
} from '../dto';
import { UserSettings } from './user-settings.schema';

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
}

export interface WindowApi {
  app: WindowAppApi;
  settings: WindowSettingsApi;
  utilities: WindowUtilitiesApi;
  session: WindowSessionApi;
  files: WindowFilesApi;
}
