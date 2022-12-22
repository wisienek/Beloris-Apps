import { useState, useContext } from 'react';
import { ErrorSeverity } from '../../single/error-message';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../sections/package-editor-state';
import * as React from 'react';
import { ErrorContext } from '../../combined/error-box';

export const useUploadFiles = () => {
  const { addError } = React.useContext(ErrorContext);

  const { version, isPackage, files, isCurrentVersion } =
    useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [sending, setSending] = useState<boolean>(false);

  const uploadFiles = async () => {
    setSending(true);

    if (isPackage) {
      const packageInfo = files[0];
      if (!('hash' in packageInfo)) {
        console.error(`Package info is not instance of UploadPackageInfo`);

        setSending(false);
        return;
      }

      // invoke upload
      // FIXME: add isCurrentVersion
      window.api.files
        .uploadPackage(version, packageInfo)
        .then(({ data, error }) => {
          setSending(false);

          if (error) {
            addError(
              ErrorSeverity.ERROR,
              error.message,
              false,
              null,
              `Przesyłanie paczki`,
            );

            return;
          }

          console.log(`Created package data: `, data);
        })
        .catch((error) => {
          console.error(error);
          setSending(false);
        });
    }
  };

  return { sending, uploadFiles };
};
