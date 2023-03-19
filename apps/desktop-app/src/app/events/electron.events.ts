/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { FileUploadDto, UploadPackageInfo } from '@bella/dto';
import { VersionType } from '@bella/types';
import { IPCChannels } from '@bella/enums';
import {
  openFileDialog,
  readUserSettings,
  saveUserSettings,
  getSession,
  logout,
  getDownloaderFiles,
  buildPackage,
  uploaderHandler,
  externalLinksHandler,
  windowsHandler,
} from '@bella/dp';
import { environment } from '../../environments/environment';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// handle events

ipcMain.handle(IPCChannels.GET_APP_VERSION, () => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// settings
ipcMain.handle(IPCChannels.GET_USER_SETTINGS, readUserSettings);
ipcMain.handle(IPCChannels.SAVE_USER_SETTINGS, saveUserSettings);
ipcMain.handle(IPCChannels.OPEN_FILE_DIALOG, openFileDialog);

// windows
ipcMain.handle(IPCChannels.OPEN_EXTERNAL_LINK, externalLinksHandler.openExternalLink);
ipcMain.handle(IPCChannels.OPEN_LOGIN_LINK, (_, url: string) => {
  console.log(`url`, url);
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
    show: false,
  });

  window.loadURL(url);
  window.show();
  console.log(`Opened new url window ${url}`);
});
ipcMain.handle(IPCChannels.NOTIFICATION, (_, title, message) => windowsHandler.openNotification(title, message));

// session
ipcMain.handle(IPCChannels.GET_SESSION, getSession);
ipcMain.handle(IPCChannels.LOGOUT, logout);
ipcMain.handle(IPCChannels.SET_SESSION, (event, cookie) => ipcRenderer.invoke(IPCChannels.SET_SESSION, cookie));

// files
ipcMain.handle(IPCChannels.LIST_DOWNLOADER_FILES, getDownloaderFiles);
ipcMain.handle(IPCChannels.BUILD_PACKAGE, buildPackage);

// uploader

ipcMain.handle(
  IPCChannels.UPLOAD_PACKAGE,
  (_, version: VersionType, packageData: UploadPackageInfo, setCurrentVersion?: boolean) =>
    uploaderHandler.uploadPackage(version, packageData, setCurrentVersion),
);
ipcMain.handle(
  IPCChannels.UPLOAD_FILES,
  (_, version: VersionType, filesData: Array<FileUploadDto>, setCurrentVersion?: boolean) =>
    uploaderHandler.uploadFiles(version, filesData, setCurrentVersion),
);

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
