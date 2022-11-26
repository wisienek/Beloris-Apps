import { useContext, useEffect, useState } from 'react';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../package-editor-state';
import { FileUploadDto } from '@bella/dto';

export const useFiles = () => {
  const { addError } = useContext(ErrorContext);
  const { files, setFiles } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  const [filesMap, setFilesMap] = useState<Record<number, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);

  const mapFromFiles = (data: FileUploadDto[]) => {
    return Object.fromEntries(new Map(data.map((f, i) => [i, f.savePath])));
  };

  const intelligentSearch = async () => {
    const filesFetch = await window.api.files.getDownloaderFiles();

    if (filesFetch.error) {
      addError(
        ErrorSeverity.ERROR,
        filesFetch?.error?.message,
        false,
        null,
        `Inteligentne szukanie plików`,
      );

      return;
    }

    setFiles(filesFetch.data);

    const fetchedAndMappedFiles = mapFromFiles(filesFetch.data);

    setFilesMap(fetchedAndMappedFiles);
  };

  const accept = () => {
    if (!selectedFiles || selectedFiles?.length === 0) {
      addError(ErrorSeverity.ERROR, `Brak plików do zaakceptowania!`, false);
      return;
    }

    const filteredFiles = files.filter(
      (file) =>
        !('hash' in file) &&
        selectedFiles.some((f) => filesMap[f] === file.savePath),
    ) as FileUploadDto[];

    const mappedNewFiles = { ...filesMap };
    const keys = Object.keys(filesMap);

    for (const i of keys)
      if (!selectedFiles.includes(Number(i))) delete mappedNewFiles[i];

    setFiles(filteredFiles);
    setFilesMap(mappedNewFiles);
  };

  return { accept, filesMap, intelligentSearch, setSelectedFiles };
};
