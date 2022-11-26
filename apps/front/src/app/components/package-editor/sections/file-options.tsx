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
    const fileToMark = files.find((f) => f.savePath === savePath);
    if (!fileToMark) {
      addError(
        ErrorSeverity.ERROR,
        `Nie znaleziono pliku: ${savePath}`,
        false,
        null,
        `Opcje pliku`,
      );

      return;
    }

    const editedFile = { ...fileToMark, ...options };
    const filtered = files.filter((f) => f.savePath !== savePath);

    setFiles([...filtered, editedFile]);
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
