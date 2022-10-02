import { IpcFileChoseEnum } from '../enums';
import {
  AllowedUploaderFileExtensions,
  AllowedUploaderPackageExtensions,
} from './allowed-uploader-file-extensions';

type ElectronFileTypeFilter = {
  name: string;
  extensions: string[];
};

export const IpcFileMap: Record<
  IpcFileChoseEnum,
  | ElectronFileTypeFilter
  | Array<
      | 'openFile'
      | 'openDirectory'
      | 'multiSelections'
      | 'showHiddenFiles'
      | 'createDirectory'
      | 'promptToCreate'
      | 'noResolveAliases'
      | 'treatPackageAsDirectory'
      | 'dontAddToRecent'
    >
> = {
  [IpcFileChoseEnum.ANY]: {
    name: 'Wszystkie pliki',
    extensions: ['*'],
  },
  [IpcFileChoseEnum.DIRECTORIES]: ['openDirectory', 'multiSelections'],
  [IpcFileChoseEnum.PACKAGE]: {
    name: 'Paczka',
    extensions: AllowedUploaderPackageExtensions,
  },
  [IpcFileChoseEnum.VERSION_FILE]: {
    name: 'Plik wersji',
    extensions: AllowedUploaderFileExtensions,
  },
};