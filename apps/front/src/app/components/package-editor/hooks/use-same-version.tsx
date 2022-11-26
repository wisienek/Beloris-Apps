import { useContext, useEffect, useState } from 'react';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../sections/package-editor-state';

export const useSameVersion = () => {
  const { version, versionHistory } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  const [isSameVersion, setIsSameVersion] = useState<boolean>(false);

  useEffect(() => {
    if (version && versionHistory) {
      const same = versionHistory.some(
        (v) =>
          v?.minor === (version?.minor ?? 1) && v?.major === version?.major,
      );

      isSameVersion !== same && setIsSameVersion(same);
    }
  }, [version, versionHistory]);

  return { isSameVersion };
};
