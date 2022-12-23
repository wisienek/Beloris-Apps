/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain, ipcRenderer } from 'electron';

import { environment } from '../../environments/environment';

import { IPCChannels } from '@bella/enums';
import {
  openFileDialog,
  readUserSettings,
  saveUserSettings,
  openExternalLink,
  openLoginLink,
  getSession,
  logout,
  getDownloaderFiles,
  buildPackage,
  uploadPackage,
  uploadFiles,
} from '@bella/dp';
import { VersionType } from '@bella/types';
import { FileUploadDto, UploadPackageInfo } from '@bella/dto';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.handle(IPCChannels.GET_APP_VERSION, () => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// settings
ipcMain.handle(IPCChannels.GET_USER_SETTINGS, readUserSettings);
ipcMain.handle(IPCChannels.SAVE_USER_SETTINGS, saveUserSettings);
ipcMain.handle(IPCChannels.OPEN_FILE_DIALOG, openFileDialog);

// external link
ipcMain.handle(IPCChannels.OPEN_EXTERNAL_LINK, openExternalLink);
ipcMain.handle(IPCChannels.OPEN_LOGIN_LINK, openLoginLink);

// session
ipcMain.handle(IPCChannels.GET_SESSION, getSession);
ipcMain.handle(IPCChannels.LOGOUT, logout);
ipcMain.handle(IPCChannels.SET_SESSION, (event, cookie) =>
  ipcRenderer.invoke(IPCChannels.SET_SESSION, cookie),
);

// files
ipcMain.handle(IPCChannels.LIST_DOWNLOADER_FILES, getDownloaderFiles);
ipcMain.handle(IPCChannels.BUILD_PACKAGE, buildPackage);

// uploader

ipcMain.handle(
  IPCChannels.UPLOAD_PACKAGE,
  (
    _,
    version: VersionType,
    packageData: UploadPackageInfo,
    setCurrentVersion?: boolean,
  ) => uploadPackage(version, packageData, setCurrentVersion),
);
ipcMain.handle(
  IPCChannels.UPLOAD_FILES,
  (
    _,
    version: VersionType,
    filesData: Array<FileUploadDto>,
    setCurrentVersion?: boolean,
  ) => uploadFiles(version, filesData, setCurrentVersion),
);

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
