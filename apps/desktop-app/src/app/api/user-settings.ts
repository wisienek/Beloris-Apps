import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { IpcEventDto, UserSettings } from '@bella/shared';
import { IpcMainEvent, dialog } from 'electron';

export const UserSettingsFilePath = join(homedir(), 'bella-settings.json');

export const readUserSettings = (): IpcEventDto<UserSettings> => {
  let replyMessage: IpcEventDto<UserSettings>;

  try {
    if (!existsSync(UserSettingsFilePath))
      throw new Error(`No settings file at ${UserSettingsFilePath}`);

    const file = readFileSync(UserSettingsFilePath, { encoding: 'utf-8' });

    replyMessage = JSON.parse(file);
  } catch (err) {
    replyMessage = {
      failed: true,
      error: err,
      data: null,
    };

    console.error(
      `Error while loading bella-settings-file ${UserSettingsFilePath}`,
      err,
    );
  }

  return replyMessage;
};

export const openFileDialog = async (): Promise<IpcEventDto<string>> => {
  let replyMessage: IpcEventDto<string>;

  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Wybierz folder',
      buttonLabel: 'Wybierz',
      properties: ['openDirectory', 'multiSelections'],
    });

    if (canceled) throw new Error(`User zakończył akcję bez wyboru!`);

    const directory = filePaths[0];

    replyMessage = {
      failed: false,
      data: directory,
    };
  } catch (error) {
    replyMessage = {
      failed: true,
      error: error,
      data: null,
    };

    console.error(`Error while getting folder from user`, error);
  }

  return replyMessage;
};

export const saveUserSettings = (
  event: IpcMainEvent,
  data: Partial<UserSettings>,
): IpcEventDto<boolean> => {
  let replyMessage: IpcEventDto<boolean>;

  try {
    const dataToSave = JSON.stringify(data, null, 2);

    writeFileSync(UserSettingsFilePath, dataToSave, 'utf-8');

    replyMessage = {
      failed: false,
    };
  } catch (err) {
    replyMessage = {
      error: err,
      failed: false,
    };

    console.error(`Error while saving bella-settings-file`, err);
  }

  return replyMessage;
};
