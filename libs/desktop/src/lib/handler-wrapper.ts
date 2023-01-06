import { IpcEventDto } from '@bella/dto';
import { ElectronLogger } from './utils';

export const handlerWrapper = async <U>(
  fn: () => U | Promise<U>,
  logger?: ElectronLogger,
  message?: string,
): Promise<IpcEventDto<U>> => {
  let replyMessage: IpcEventDto<U>;

  try {
    const data = await fn();

    replyMessage = {
      failed: false,
      data,
    };
  } catch (err) {
    replyMessage = {
      failed: true,
      error: err?.isAxiosError ? err.response.data : err,
      data: null,
    };

    (logger ?? console).error(replyMessage.error);
    message && (logger ?? console).error(message);
  }

  return replyMessage;
};
