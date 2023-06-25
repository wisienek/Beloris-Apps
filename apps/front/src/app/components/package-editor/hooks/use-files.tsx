import { useContext, useState } from 'react';
import { EditFleOptions, FileToUploadDto, FileUploadDto } from '@bella/dto';
import { PackageEditorStateContext, PackageEditorStateValue } from '../sections/package-editor.state';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';

export const useFiles = () => {
  const { addError } = useContext(ErrorContext);
  const { setFiles, versionHistory, version } = useContext<PackageEditorStateValue>(PackageEditorStateContext);
  const [versionedFiles, setVersionedFiles] = useState<FileToUploadDto[]>([]);
  const [accepted, setAccepted] = useState<boolean>(false);

  const intelligentSearch = async () => {
    const filesFetch = await window.api.files.getDownloaderFiles();

    if (filesFetch.error) {
      addError(ErrorSeverity.ERROR, filesFetch?.error?.message, false, null, `Inteligentne szukanie plików`);
      return;
    }

    const mappedFiles = setSelectedFiles(filesFetch.data);
    setVersionedFiles([...mappedFiles]);
  };

  const setSelectedFiles = (files: FileUploadDto[]): FileToUploadDto[] =>
    files.map((f) => ({ ...f, selected: isFileInHistory(f) }));

  const isFileInHistory = (file: FileUploadDto): boolean => {
    const searchedVersion = versionHistory.find((v) => v.major === version.major && v.minor === version.minor);
    if (!searchedVersion) return false;

    const foundFile = searchedVersion.files.find((f) => f.savePath === file.savePath);
    return !!foundFile;
  };

  const selectFile = (file: FileToUploadDto): void => {
    setVersionedFiles((prevVersionedFiles) => {
      const tempFiles = [...prevVersionedFiles];
      const foundFile = tempFiles.find((f) => f.savePath === file.savePath);
      if (!foundFile) return prevVersionedFiles;

      foundFile.selected = !foundFile.selected;
      return tempFiles;
    });
  };

  const editFile = (savePath: string, options: EditFleOptions) => {
    setVersionedFiles((prevVersionedFiles) => {
      const tempFiles = [...prevVersionedFiles];
      const foundFile = tempFiles.find((f) => f.savePath === savePath);
      if (!foundFile) return prevVersionedFiles;

      const fileValues = Object.entries(options);
      for (const [key, value] of fileValues) {
        foundFile[key] = value;
      }

      return tempFiles;
    });
  };

  const finishEditingFiles = () => {
    const finished = versionedFiles.filter((f) => f.selected);
    setVersionedFiles(finished);
    setFiles(
      finished.map((f) => {
        delete f.selected;
        return f;
      })
    );

    setAccepted(true);

    addError(ErrorSeverity.INFO, `Zaakceptowano pliki!`, true, null, `Edytor plików`);
  };

  return { versionedFiles, intelligentSearch, selectFile, editFile, finishEditingFiles, accepted };
};
