import { useState, useContext } from 'react';
import { ErrorSeverity } from '../../single/error-message';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../package-editor-state';
import * as React from 'react';
import { ErrorContext } from '../../combined/error-box';

export const useUploadFiles = () => {
  const { addError } = React.useContext(ErrorContext);

  const { version, isPackage, files } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

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

      try {
        // invoke upload
        const { data, error } = await window.api.files.uploadPackage(
          version,
          packageInfo,
        );

        if (error)
          addError(
            ErrorSeverity.ERROR,
            error.message,
            false,
            null,
            `Przesyłanie paczki`,
          );

        console.log(`Created package data: `, data);
      } catch (error) {
        console.error(error);
      }

      setSending(false);
    }
  };

  return { sending, uploadFiles };
};
