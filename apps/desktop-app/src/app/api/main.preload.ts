import { contextBridge, ipcRenderer } from 'electron';
import {
  IPCChannels,
  IpcEventDto,
  TokenDto,
  UserSettings,
  VersionDto,
  WindowApi,
} from '@bella/shared';

const windowApi: WindowApi = {
  versioning: {
    getPackageVersion: () =>
      ipcRenderer.invoke(IPCChannels.GET_DOWNLOAD_VERSION) as Promise<
        IpcEventDto<VersionDto>
      >,
    setPackageVersion: (version: VersionDto) =>
      ipcRenderer.invoke(IPCChannels.SET_DOWNLOAD_VERSION, version) as Promise<
        IpcEventDto<boolean>
      >,
  },
  app: {
    platform: process.platform,
    getAppVersion: () => ipcRenderer.invoke(IPCChannels.GET_APP_VERSION),
  },
  settings: {
    getUserSettings: () => ipcRenderer.invoke(IPCChannels.GET_USER_SETTINGS),
    saveUserSettings: (data: Partial<UserSettings>) =>
      ipcRenderer.invoke(IPCChannels.SAVE_USER_SETTINGS, data),
    openFileDialog: () => ipcRenderer.invoke(IPCChannels.OPEN_FILE_DIALOG),
  },
  utilities: {
    openExternalLink: (link: string) =>
      ipcRenderer.invoke(IPCChannels.OPEN_EXTERNAL_LINK, link) as Promise<
        IpcEventDto<boolean>
      >,
    getSession: () =>
      ipcRenderer.invoke(IPCChannels.GET_SESSION) as Promise<
        IpcEventDto<TokenDto>
      >,
    receiveSession: (func) => {
      ipcRenderer.on(IPCChannels.SET_SESSION, (event, ...args) =>
        func(...args),
      );
    },
  },
};

contextBridge.exposeInMainWorld('api', windowApi);
