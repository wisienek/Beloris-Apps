import { VersionDto } from '../dto';

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
