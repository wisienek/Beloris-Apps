import { useState, useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { DownloaderFileDto, FileUploadDto } from '@bella/dto';
import { IPCChannels } from '@bella/enums';
import { PackageEditorStateContext, PackageEditorStateValue } from '../sections/package-editor-state';
import { isFileData } from '../../../utils/file-data.guard';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';

export const useUploadFiles = () => {
  const { addError } = useContext(ErrorContext);
  const { version, files, isCurrentVersion } = useContext<PackageEditorStateValue>(PackageEditorStateContext);
  const [sending, setSending] = useState<boolean>(false);
  const [sendingProgress, setSendingProgress] = useState<Record<'uploading' | 'finished', Array<string>>>({
    uploading: [],
    finished: [],
  });
  const [sent, setSent] = useState<boolean>(false);

  const updateProgress = (event: IpcRendererEvent, uploaded: DownloaderFileDto) => {
    const filtered = sendingProgress.uploading.filter((u) => u !== uploaded.name);
    const newFinished = [...sendingProgress.finished, uploaded.name];

    if (filtered.length === sendingProgress.uploading.length) {
      console.error(`Uploading name not found [${sendingProgress.uploading.join(', ')}], ${uploaded.name}`);
    }

    setSendingProgress({ uploading: filtered, finished: newFinished });
  };

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

      setSendingProgress({
        uploading: files.map((f) => f.name),
        finished: [],
      });

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

  useEffect(() => {
    ipcRenderer.on(IPCChannels.UPLOAD_PROGRESS, updateProgress);

    return () => {
      ipcRenderer.removeListener(IPCChannels.UPLOAD_PROGRESS, updateProgress);
    };
  }, [IPCChannels.UPLOAD_PROGRESS]);

  return { sending, sendingProgress, uploadFiles, sent };
};
