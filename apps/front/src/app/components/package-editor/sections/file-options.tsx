import { useContext } from 'react';

import { EditFleOptions } from '@bella/dto';

import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';
import FileOptionsTableContainer from '../atoms/file-options-table';

const FileOptions = () => {
  const { addError } = useContext(ErrorContext);

  const { isPackage, files, setFiles } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  const editFile = (savePath: string, options: EditFleOptions) => {
    const fileIndex = files.findIndex((f) => f.savePath === savePath);
    if (!fileIndex || fileIndex < 0) {
      addError(
        ErrorSeverity.ERROR,
        `Nie znaleziono pliku: ${savePath}`,
        false,
        null,
        `Opcje pliku`,
      );

      return;
    }

    const newFiles = [...files];
    const fileValues = Object.values(options);
    for (const [key, value] of fileValues) newFiles[fileIndex][key] = value;

    setFiles(newFiles);
  };

  return isPackage ? (
    <>Nie powinieneś tutaj byc 0.0</>
  ) : (
    <>
      <FileOptionsTableContainer editFile={editFile} />
    </>
  );
};

export default FileOptions;
