import { useState, useContext } from 'react';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';
import { PackageEditorStateContext, PackageEditorStateValue } from '../sections/package-editor-state';
import { isFileData } from '../../../utils/file-data.guard';
import { FileUploadDto } from '@bella/dto';

export const useUploadFiles = () => {
  const { addError } = useContext(ErrorContext);

  const { version, isPackage, files, isCurrentVersion } =
    useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

  const uploadFiles = async () => {
    setSending(true);

    const packageInfo = files[0];

    if ('fileSize' in packageInfo) {
      if (!('hash' in packageInfo)) {
        console.error(`Package info is not instance of UploadPackageInfo`);

        setSending(false);
        return;
      }

      window.api.files
        .uploadPackage(version, packageInfo, isCurrentVersion)
        .then(({ data, error }) => {
          setSending(false);

          if (error) {
            addError(ErrorSeverity.ERROR, error.message, false, null, `Przesyłanie paczki`);

            return;
          }

          console.log(`Created package data: `, data);

          addError(ErrorSeverity.SUCCESS, `Przesłano paczkę`);
          window.api.windows.notify(
            `Uploader`,
            `Przesłano paczkę ${packageInfo.name} do wersji ${version.major}.${version.minor}`,
          );
          setSent(true);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setSending(false);
        });
    } else {
      if (files.length === 0) {
        addError(ErrorSeverity.ERROR, 'Brak zmian do przesłania!', false, null, `Przesyłanie plików`);

        return;
      }

      if (files.some((f) => !isFileData(f))) {
        addError(ErrorSeverity.ERROR, 'Dziwne dane...', false, null, `Sprawdzanie plików`);

        console.error(files);

        return;
      }

      console.log(
        `Sending ${files.length} files for version: ${version.major}.${version.minor}, shouldSetCurrent: ${isCurrentVersion}`,
      );
      setSending(true);

      window.api.files
        .uploadFiles(version, files as Array<FileUploadDto>, isCurrentVersion)
        .then(({ data, error }) => {
          setSending(false);

          if (error) {
            addError(ErrorSeverity.ERROR, error.message, false, null, `Przesyłanie plików`);

            return;
          }

          console.log(`Created files data: `, data);

          addError(ErrorSeverity.SUCCESS, `Przesłano pliki`, true);
          window.api.windows.notify(
            `Przesłano pliki`,
            `Zakończono przesyłanie plików do wersji ${version.major}.${version.minor}!`,
          );
          setSent(true);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setSending(false);
        });
    }
  };

  return { sending, uploadFiles, sent };
};
