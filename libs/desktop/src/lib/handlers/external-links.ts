import { IpcMainEvent, shell } from 'electron';
import { IpcEventDto } from '@bella/dto';

export const openExternalLink = async (
  event: IpcMainEvent,
  link: string,
): Promise<IpcEventDto<boolean>> => {
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
};

export const openLoginLink = async (
  event: IpcMainEvent,
  link: string,
): Promise<void> => {
  return;
};
