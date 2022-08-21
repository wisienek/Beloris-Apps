import { dialog } from 'electron';
import { sync } from 'glob-promise';
import { parse, sep } from 'path';

import { FileDialogInputDto, FileUploadDto, IpcEventDto } from '@bella/dto';
import { AllowedUploaderFileExtensions, IpcFileMap } from '@bella/data';
import { FileAction } from '@bella/enums';

import { handlerWrapper } from '../handler-wrapper';
import { readUserSettings } from './user-settings';

export const openFileDialog = async (
  event,
  { fileType }: FileDialogInputDto,
): Promise<IpcEventDto<string>> => {
  return await handlerWrapper(async () => {
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
  }, `Error while getting folder from user`);
};

export const getDownloaderFiles = async (): Promise<
  IpcEventDto<FileUploadDto[]>
> => {
  return await handlerWrapper(async () => {
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

    return foundFiles.map((filePath) => {
      return new FileUploadDto({
        name: parse(filePath.split(sep).at(-1)).name,
        savePath: filePath,
        required: true,
        fileAction: FileAction.DOWNLOAD,
      });
    });
  }, `Error while preparing downloader files`);
};
