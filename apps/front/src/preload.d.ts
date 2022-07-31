import { WindowApi } from '@bella/shared';

declare global {
  interface Window {
    api: WindowApi;
  }
}

export {};
