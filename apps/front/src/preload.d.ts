import { IpcRenderer } from 'electron';
import { WindowApi } from '@bella/schema';

declare global {
  interface Window {
    api: WindowApi;
    ipcRenderer: IpcRenderer;
  }
}

export const { ipcRenderer } = window;
