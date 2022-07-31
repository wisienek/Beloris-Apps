import { join } from 'path';
import { homedir } from 'os';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { IpcMainEvent } from 'electron';

import { IpcEventDto, VersionDto } from '@bella/shared';

export const UserVersionFilePath = join(homedir(), 'bella-version.json');

export const getDownloadVersionData = () => {
  let replyMessage: IpcEventDto<VersionDto>;

  try {
    if (!existsSync(UserVersionFilePath))
      throw new Error(`No version file at ${UserVersionFilePath}`);

    const file = readFileSync(UserVersionFilePath, { encoding: 'utf-8' });

    replyMessage = JSON.parse(file);
  } catch (err) {
    replyMessage = {
      failed: true,
      error: err,
      data: null,
    };

    console.error(
      `Error while loading bella-version-file ${UserVersionFilePath}`,
      err,
    );
  }

  return replyMessage;
};

export const setDownloadVersionData = (
  event: IpcMainEvent,
  version: VersionDto,
) => {
  let returnMessage: IpcEventDto<boolean>;

  try {
    if (!version) throw new Error(`Nie podano danych do zapisu wersji!`);

    const dataToSave = JSON.stringify(version, null, 2);

    writeFileSync(UserVersionFilePath, dataToSave, 'utf-8');

    returnMessage = {
      failed: false,
    };
  } catch (err) {
    returnMessage = {
      error: err,
      failed: false,
    };

    console.error(`Error while saving bella-version-file`, err);
  }

  return returnMessage;
};
