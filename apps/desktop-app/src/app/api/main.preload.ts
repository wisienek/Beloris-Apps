import { contextBridge, ipcRenderer } from 'electron';
import {
  FileDialogInputDto,
  IpcEventDto,
  TokenDto,
  VersionDto,
} from '@bella/dto';
import { UserSettings, WindowApi } from '@bella/schema';
import { IPCChannels } from '@bella/enums';

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
  },
  files: {
    openFileDialog: (data: FileDialogInputDto) =>
      ipcRenderer.invoke(IPCChannels.OPEN_FILE_DIALOG, data),
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
