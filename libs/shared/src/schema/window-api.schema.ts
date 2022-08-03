import { IpcEventDto, VersionDto } from '../dto';
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
    openFileDialog: () => Promise<IpcEventDto<string>>;
  };
  utilities: {
    openExternalLink: (link: string) => Promise<IpcEventDto<boolean>>;
  };
}
