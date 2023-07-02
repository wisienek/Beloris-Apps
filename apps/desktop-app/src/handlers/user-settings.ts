import { IpcMainEvent } from 'electron';
import { UserSettings } from '@bella/schema';
import { IpcEventDto } from '@bella/dto';
import { handlerWrapper } from './handler-wrapper';
import { Store, StoreKeys } from '../store';

export const readUserSettings = async (): Promise<IpcEventDto<UserSettings>> => {
  return await handlerWrapper(
    async () => {
      const settings = Store.get(StoreKeys.SETTINGS) as unknown as UserSettings;
      if (!settings) throw new Error(`Brak ustawień!`);

      return settings;
    },
    null,
    `Error while loading bella-settings-file`,
  );
};

export const saveUserSettings = async (
  event: IpcMainEvent,
  data: Partial<UserSettings>,
): Promise<IpcEventDto<boolean>> => {
  return await handlerWrapper(
    async () => {
      Store.set(StoreKeys.SETTINGS, data);
      return true;
    },
    null,
    `Error while saving bella-settings-file`,
  );
};
