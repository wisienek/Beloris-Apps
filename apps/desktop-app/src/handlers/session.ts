import { IpcEventDto, TokenDto } from '@bella/dto';
import { handlerWrapper } from './handler-wrapper';
import { Store, StoreKeys } from '../store';

export const getSession = async (): Promise<IpcEventDto<TokenDto>> => {
  return await handlerWrapper(
    async () => {
      const session = Store.get(StoreKeys.SESSION) as unknown as TokenDto;
      if (!session || !session?.access_token) throw new Error(`Brak sesji!`);

      return session;
    },
    null,
    `Error while loading bella-session from store`,
  );
};

export const logout = async (): Promise<IpcEventDto<boolean>> => {
  return await handlerWrapper(
    async () => {
      Store.delete(StoreKeys.SESSION);
      return true;
    },
    null,
    `Error while deleting bella-session from store`,
  );
};
