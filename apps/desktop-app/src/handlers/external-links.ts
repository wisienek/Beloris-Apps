import { IpcMainEvent, shell, IpcMainInvokeEvent } from 'electron';
import { IpcEventDto } from '@bella/dto';
import { BaseHandler } from './base-handler';

export class ExternalLinksHandler extends BaseHandler {
  constructor() {
    super(ExternalLinksHandler.name);
  }

  public async openExternalLink(event: IpcMainEvent, link: string): Promise<IpcEventDto<boolean>> {
    let replyMessage: IpcEventDto<boolean>;

    try {
      await shell.openExternal(link);

      replyMessage = {
        failed: false,
        data: true,
      };
    } catch (err) {
      replyMessage = {
        error: err,
        failed: false,
      };

      console.error(`Error while Opening external link`, err);
    }

    return replyMessage;
  }

  public async openLoginLink(event: IpcMainInvokeEvent, ...rest): Promise<void> {
    this.logger.log(`will open`, ...rest);
    return;
  }
}

export const externalLinksHandler = new ExternalLinksHandler();
