import { contextBridge, ipcRenderer } from 'electron';
import {
  DownloaderFileDto,
  FileDialogInputDto,
  FileUploadDto,
  IpcEventDto,
  PackageDataDto,
  TokenDto,
  UploadPackageInfo,
} from '@bella/dto';
import { UserSettings, WindowApi } from '@bella/schema';
import { IPCChannels } from '@bella/enums';
import { VersionType } from '@bella/types';

const windowApi: WindowApi = {
  app: {
    platform: process.platform,
    getAppVersion: () => ipcRenderer.invoke(IPCChannels.GET_APP_VERSION),
  },
  settings: {
    getUserSettings: () => ipcRenderer.invoke(IPCChannels.GET_USER_SETTINGS),
    saveUserSettings: (data: Partial<UserSettings>) =>
      ipcRenderer.invoke(IPCChannels.SAVE_USER_SETTINGS, data),
  },
  files: {
    openFileDialog: (data: FileDialogInputDto) =>
      ipcRenderer.invoke(IPCChannels.OPEN_FILE_DIALOG, data),

    getDownloaderFiles: () =>
      ipcRenderer.invoke(IPCChannels.LIST_DOWNLOADER_FILES) as Promise<
        IpcEventDto<FileUploadDto[]>
      >,

    buildModpackPackage: (version: number) =>
      ipcRenderer.invoke(IPCChannels.BUILD_PACKAGE, version) as Promise<
        IpcEventDto<PackageDataDto>
      >,

    uploadPackage: (version: VersionType, packageData: UploadPackageInfo) =>
      ipcRenderer.invoke(
        IPCChannels.UPLOAD_PACKAGE,
        version,
        packageData,
      ) as Promise<IpcEventDto<DownloaderFileDto>>,

    uploadFiles: (version: VersionType, packageData: PackageDataDto) =>
      ipcRenderer.invoke(
        IPCChannels.UPLOAD_FILES,
        version,
        packageData,
      ) as Promise<IpcEventDto<DownloaderFileDto[]>>,
  },
  utilities: {
    openExternalLink: (link: string) =>
      ipcRenderer.invoke(IPCChannels.OPEN_EXTERNAL_LINK, link) as Promise<
        IpcEventDto<boolean>
      >,
  },
  session: {
    getSession: () =>
      ipcRenderer.invoke(IPCChannels.GET_SESSION) as Promise<
        IpcEventDto<TokenDto>
      >,
    logout: () =>
      ipcRenderer.invoke(IPCChannels.LOGOUT) as Promise<IpcEventDto<boolean>>,
    receiveSession: (func) => {
      ipcRenderer.on(IPCChannels.SET_SESSION, (event, ...args) =>
        func(...args),
      );
    },
  },
};

contextBridge.exposeInMainWorld('api', windowApi);
