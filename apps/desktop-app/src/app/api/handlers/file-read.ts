import { FileDialogInputDto, IpcEventDto } from '@bella/dto';
import { dialog } from 'electron';
import { IpcFileMap } from '@bella/data';

export const openFileDialog = async (
  event,
  { fileType }: FileDialogInputDto,
): Promise<IpcEventDto<string>> => {
  let replyMessage: IpcEventDto<string>;

  try {
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
