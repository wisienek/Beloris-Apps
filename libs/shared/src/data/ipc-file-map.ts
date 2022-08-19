import { IpcFileChoseEnum } from '../enums';

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
    extensions: ['gz', 'rar', 'tar', 'jar', '7z'],
  },
  [IpcFileChoseEnum.VERSION_FILE]: {
    name: 'Plik wersji',
    extensions: [
      'png',
      'cfg',
      'txt',
      'json',
      'toml',
      'dat',
      'ogg',
      'jar',
      'rar',
      'zip',
    ],
  },
};
