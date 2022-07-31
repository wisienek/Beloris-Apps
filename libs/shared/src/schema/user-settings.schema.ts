import { VersionDto } from '@bella/shared';

export class UserSettings {
  version?: VersionSettings;
  downloadTo: DownloadInfo;
}

export class VersionSettings {
  currentVersion: VersionDto;
  downloadedDate: Date;
  omittedFilesUUIDS: string[];
}

export class DownloadInfo {
  mcFolder: string;
  modpackFolder: string;
}
