import { VersionDto } from '@bella/dto';

export type UserVersion = Omit<VersionDto, 'files'>;

export class VersionSettings {
  currentVersion: UserVersion;
  downloadedDate: Date;
  omittedFilesUUIDS: string[];
}

export class DownloadInfo {
  mcFolder: string;
  modpackFolder: string;
}

export class UserSettings {
  version?: VersionSettings;
  downloadTo: DownloadInfo;
}
