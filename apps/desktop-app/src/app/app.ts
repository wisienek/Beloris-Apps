import { BrowserWindow, screen, globalShortcut } from 'electron';
import * as Sentry from '@sentry/electron';
import { join, resolve } from 'path';
import * as process from 'process';
import { format } from 'url';
import 'dotenv/config';
import { IPCChannels } from '@bella/enums';
import { rendererAppName, rendererAppPort } from './constants';
import { environment } from '../environments/environment';
import { Store, StoreKeys } from '../store';
import { ElectronLogger } from '../utils';

export default class App {
  private static Logger = new ElectronLogger(App.name);

  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;
  static Protocol: string;

  public static isDevelopmentMode() {
    const isEnvironmentSet: boolean = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnvironment: boolean = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

    return isEnvironmentSet ? getFromEnvironment : !environment.production;
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      App.application.quit();
    }
  }

  private static onClose() {
    App.mainWindow = null;
  }

  private static onReady() {
    App.initProtocol();
    App.registerShortcuts();

    App.initMainWindow();
    App.loadMainWindow();
  }

  private static initProtocol(): void {
    App.Protocol = 'bella'; //!App.application.isPackaged ? 'bellatest' : 'bella';
    App.Logger.log(`Registering Protocol ${App.Protocol}::`);

    if (!App.application.isPackaged && process.platform === 'win32') {
      App.Logger.log(process.execPath, process.argv);

      App.application.setAsDefaultProtocolClient(App.Protocol, process.execPath, [resolve(process.argv[2])]);
    } else {
      App.application.setAsDefaultProtocolClient(App.Protocol);
    }
  }

  private static registerShortcuts() {
    globalShortcut.register('f5', () => App.mainWindow.reload());
    globalShortcut.register('CommandOrControl+R', () => App.mainWindow.reload());
  }

  private static onActivate() {
    if (App.mainWindow === null) {
      App.onReady();
    }
  }

  private static initMainWindow() {
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
    const width = Math.min(1280, workAreaSize.width || 1280);
    const height = Math.min(1100, workAreaSize.height || 1100);

    // Create the browser window.
    App.mainWindow = new BrowserWindow({
      width: width,
      height: height,
      minWidth: 920,
      minHeight: 1100,
      show: false,
      webPreferences: {
        contextIsolation: true,
        backgroundThrottling: false,
        preload: join(__dirname, 'main.preload.js'),
      },
    });
    App.mainWindow.setMenu(null);
    App.mainWindow.center();

    App.mainWindow.once('ready-to-show', () => {
      App.mainWindow.show();

      App.mainWindow.webContents.openDevTools({
        mode: 'detach',
      });
    });

    // Emitted when the window is closed.
    App.mainWindow.on('closed', () => {
      App.mainWindow = null;
    });
  }

  private static loadMainWindow() {
    // load the index.html of the app.
    if (!App.application.isPackaged) {
      App.mainWindow
        .loadURL(`http://localhost:${rendererAppPort}`)
        .catch((error) => App.Logger.error(`Error while loading unpackaged app:`, error));
    } else {
      App.mainWindow
        .loadURL(
          format({
            pathname: join(__dirname, rendererAppName, 'index.html'),
            protocol: 'file:',
            slashes: true,
          }),
        )
        .catch((error) => App.Logger.error(`Error while loading packaged app:`, error));
    }
  }

  static onOpenUrl(event: Event, args: string[]) {
    const url = args.find((str: string) => str.includes(`${App.Protocol}://`))?.replace(`${App.Protocol}://`, '');

    if (url.includes('?cookie')) {
      try {
        const cookie = JSON.parse(decodeURIComponent(url.split('?cookie=')[1]));
        App.Logger.log(`Logged in from redirect`, cookie);

        Store.set(StoreKeys.SESSION, cookie);

        App.mainWindow.webContents.send(IPCChannels.SET_SESSION, cookie);
      } catch (error) {
        App.Logger.error(`Error while decoding cookie`, error);
      }
    }
  }

  static handleSecondInstance() {
    if (App.mainWindow) {
      if (App.mainWindow.isMinimized()) App.mainWindow.restore();
      App.mainWindow.focus();
    }
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    App.setupSentry();

    if (process.platform === 'win32') {
      app.setAppUserModelId(`Beloris Updater`);
    }

    App.BrowserWindow = browserWindow;
    App.application = app;

    const gotLock = app.requestSingleInstanceLock();

    if (gotLock) App.application.on('second-instance', App.handleSecondInstance);
    else App.application.quit();

    App.application.on('window-all-closed', App.onWindowAllClosed); // Quit when all windows are closed.
    App.application.on('ready', App.onReady); // App is ready to load data
    App.application.on('activate', App.onActivate); // App is activated
    App.application.on('open-url', (e, url) => App.onOpenUrl(e, [url])); // App will open url
    App.application.on('second-instance', App.onOpenUrl);
  }

  private static setupSentry() {
    if ('ELECTRON_SENTRY_KEY' in process.env && 'ELECTRON_SENTRY_ID' in process.env)
      Sentry.init({
        dsn: `https://${process.env.ELECTRON_SENTRY_KEY}.ingest.sentry.io/${process.env.ELECTRON_SENTRY_ID}`,
        environment: App.isDevelopmentMode() ? 'development' : 'production',
      });
  }
}
