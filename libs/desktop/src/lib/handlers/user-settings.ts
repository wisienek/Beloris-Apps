import { IpcMainEvent } from 'electron';

import { IpcEventDto } from '@bella/dto';
import { UserSettings } from '@bella/schema';
import { handlerWrapper } from '../handler-wrapper';
import { Store, StoreKeys } from '../store';

export const readUserSettings = async (): Promise<
  IpcEventDto<UserSettings>
> => {
  return await handlerWrapper(async () => {
    const settings = Store.get(StoreKeys.SETTINGS) as unknown as UserSettings;
    if (!settings) throw new Error(`Brak ustawień!`);

    return settings;
  }, `Error while loading bella-settings-file`);
};

export const saveUserSettings = async (
  event: IpcMainEvent,
  data: Partial<UserSettings>,
): Promise<IpcEventDto<boolean>> => {
  return await handlerWrapper(async () => {
    Store.set(StoreKeys.SETTINGS, data);
    return true;
  }, `Error while saving bella-settings-file`);
};