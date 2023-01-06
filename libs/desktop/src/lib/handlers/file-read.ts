import { readdirSync, readFileSync, statSync } from 'fs';
import { sync } from 'glob-promise';
import { dialog } from 'electron';
import { parse, sep } from 'path';
import * as tar from 'tar';
import { getFileHash } from '@bella/core';
import { FileAction } from '@bella/enums';
import {
  FileDialogInputDto,
  FileUploadDto,
  IpcEventDto,
  PackageDataDto,
} from '@bella/dto';
import {
  AllowedUploaderFileExtensions,
  IpcFileMap,
  packerFiles,
} from '@bella/data';
import { handlerWrapper } from '../handler-wrapper';
import { readUserSettings } from './user-settings';
import { getPackageName, getPackagePath } from '../utils';

export const openFileDialog = async (
  event,
  { fileType }: FileDialogInputDto,
): Promise<IpcEventDto<string>> => {
  return await handlerWrapper(
    async () => {
      const resolvedFileType = IpcFileMap[fileType];
      if (!resolvedFileType)
        throw new Error(`Nie podano poprawnego typu pliku wejściowego!`);

      const { canceled, filePaths } = await dialog.showOpenDialog(
        Object.assign(
          {
            title: fileType,
            buttonLabel: 'Wybierz',
          },
          Array.isArray(resolvedFileType)
            ? { properties: resolvedFileType }
            : { filters: [resolvedFileType] },
        ),
      );

      if (canceled) throw new Error(`Użytkownik zakończył akcję bez wyboru!`);

      return filePaths[0];
    },
    null,
    `Error while getting folder from user`,
  );
};

export const getDownloaderFiles = async (): Promise<
  IpcEventDto<FileUploadDto[]>
> => {
  return await handlerWrapper(
    async () => {
      const { data: settings } = await readUserSettings();

      if (!settings || !settings?.downloadTo?.modpackFolder)
        throw new Error(`Brak ustawionego folderu modpacka!`);

      const folderLocation = settings.downloadTo.modpackFolder;

      const foundFiles = sync(
        `**/*.{${AllowedUploaderFileExtensions.join(',')}}`,
        {
          cwd: folderLocation,
          nonull: false,
          nocase: true,
        },
      );

      return foundFiles.map((filePath) => ({
        name: parse(filePath.split(sep).at(-1)).name,
        savePath: filePath,
        required: true,
        fileAction: FileAction.DOWNLOAD,
      }));
    },
    null,
    `Error while preparing downloader files`,
  );
};

export const buildPackage = async (
  event,
  version: number,
): Promise<IpcEventDto<PackageDataDto>> => {
  return await handlerWrapper(
    async () => {
      const { data: settings } = await readUserSettings();

      const modpackFolder = settings.downloadTo.modpackFolder;
      const readDirectory = readdirSync(modpackFolder);
      const existingFiles = readDirectory.filter((f) =>
        packerFiles.includes(f),
      );

      if (existingFiles.length !== packerFiles.length)
        throw new Error(
          `Za mało plików aby spakowac paczkę; ${packerFiles
            .filter((f) => !existingFiles.includes(f))
            .join(', ')}`,
        );

      const filePath = getPackagePath(modpackFolder, version);
      await tar.create(
        {
          gzip: true,
          cwd: modpackFolder,
          file: filePath,
        },
        existingFiles,
      );

      const readFile = readFileSync(filePath);
      const stats = statSync(filePath);

      const name = getPackageName(version);
      const hash = getFileHash(readFile);
      const fileSize = stats.size;

      return { filePath, name, hash, fileSize };
    },
    null,
    `Error while building modpack package`,
  );
};
