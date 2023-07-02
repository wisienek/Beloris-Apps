import { Notification } from 'electron';
import { IpcEventDto } from '@bella/dto';
import { handlerWrapper } from './handler-wrapper';
import { ElectronLogger } from '../utils';

export class WindowsHandler {
  private readonly logger = new ElectronLogger(WindowsHandler.name);

  public openNotification(title: string, message: string): Promise<IpcEventDto<boolean>> {
    return handlerWrapper(
      () => {
        new Notification({ title, body: message }).show();
        return true;
      },
      this.logger,
      `Błąd przy otwieraniu notyfikacji`,
    );
  }
}

export const windowsHandler = new WindowsHandler();
