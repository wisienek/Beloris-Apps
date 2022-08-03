/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain } from 'electron';

import { IPCChannels } from '@bella/shared';

import { environment } from '../../environments/environment';
import {
  getDownloadVersionData,
  setDownloadVersionData,
} from '../api/version-read';
import {
  openFileDialog,
  readUserSettings,
  saveUserSettings,
} from '../api/user-settings';
import { openExternalLink } from '../api/external-links';

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

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});
