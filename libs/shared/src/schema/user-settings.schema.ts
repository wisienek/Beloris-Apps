export class UserVersion {
  major: number;
  minor: number;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
