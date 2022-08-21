import { IpcEventDto } from '@bella/dto';

export const handlerWrapper = async <U>(
  fn: () => U | Promise<U>,
  errorMessage?: string,
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
      error: err,
      data: null,
    };

    console.error(errorMessage ?? 'No provided custom message', err);
  }

  return replyMessage;
};
