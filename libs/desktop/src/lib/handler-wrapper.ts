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
      error: err?.isAxiosError ? err.response.data : err,
      data: null,
    };

    console.error(replyMessage.error);
  }

  return replyMessage;
};
