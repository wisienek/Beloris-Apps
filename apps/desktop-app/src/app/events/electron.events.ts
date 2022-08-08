/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain, ipcRenderer } from 'electron';

import { IPCChannels } from '@bella/shared';

import { environment } from '../../environments/environment';
import {
  openFileDialog,
  readUserSettings,
  saveUserSettings,
  openExternalLink,
  openLoginLink,
  getDownloadVersionData,
  setDownloadVersionData,
  getSession,
} from '../api/handlers';

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

ipcMain.handle(IPCChannels.GET_APP_VERSION, () => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// versioning
ipcMain.handle(IPCChannels.GET_DOWNLOAD_VERSION, getDownloadVersionData);
ipcMain.handle(IPCChannels.SET_DOWNLOAD_VERSION, setDownloadVersionData);

// settings
ipcMain.handle(IPCChannels.GET_USER_SETTINGS, readUserSettings);
ipcMain.handle(IPCChannels.SAVE_USER_SETTINGS, saveUserSettings);
ipcMain.handle(IPCChannels.OPEN_FILE_DIALOG, openFileDialog);

// external link
ipcMain.handle(IPCChannels.OPEN_EXTERNAL_LINK, openExternalLink);
ipcMain.handle(IPCChannels.OPEN_LOGIN_LINK, openLoginLink);

// session
ipcMain.handle(IPCChannels.GET_SESSION, getSession);

ipcMain.handle(IPCChannels.SET_SESSION, (event, cookie) =>
  ipcRenderer.invoke(IPCChannels.SET_SESSION, cookie),
);

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
