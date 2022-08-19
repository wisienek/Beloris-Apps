import { FileDialogInputDto, IpcEventDto, TokenDto, VersionDto } from '../dto';
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

export interface WindowApi {
  versioning: {
    getPackageVersion: () => Promise<IpcEventDto<VersionDto>>;
    setPackageVersion: (version: VersionDto) => Promise<IpcEventDto<boolean>>;
  };
  app: {
    getAppVersion: () => Promise<string>;
    platform: Platform;
  };
  settings: {
    getUserSettings: () => Promise<IpcEventDto<UserSettings>>;
    saveUserSettings: (
      data: Partial<UserSettings>,
    ) => Promise<IpcEventDto<boolean>>;
  };
  utilities: {
    openExternalLink: (link: string) => Promise<IpcEventDto<boolean>>;
  };
  session: {
    logout: () => Promise<IpcEventDto<boolean>>;
    getSession: () => Promise<IpcEventDto<TokenDto>>;
    receiveSession: (func: (...args: any) => void) => void;
  };
  files: {
    openFileDialog: (
      data: FileDialogInputDto,
    ) => Promise<IpcEventDto<string | string[]>>;
  };
}
