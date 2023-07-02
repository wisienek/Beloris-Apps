import { WindowApi } from '@bella/schema';

declare global {
  interface Window {
    api: WindowApi;
  }
}
