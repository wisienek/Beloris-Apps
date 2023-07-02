import { useContext, useState } from 'react';
import { UploadPackageInfo } from '@bella/dto';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';

export const usePackageCreator = () => {
  const { addError } = useContext(ErrorContext);

  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isBuilt, setIsBuilt] = useState<boolean>(false);

  const createPackage = async (version: Record<'major' | 'minor', number>) => {
    setIsBuilding(true);

    const { error, data } = await window.api.files.buildModpackPackage(version.major);
    setIsBuilding(false);

    if (error) {
      addError(ErrorSeverity.ERROR, error.message, false);
      setIsBuilt(false);
      throw error.message;
    }

    addError(ErrorSeverity.SUCCESS, `Zbudowano paczkę: ${data.filePath}!`, true);

    const packageFile: UploadPackageInfo = {
      name: data.name,
      required: true,
      savePath: '/',
      hash: data.hash,
      fileSize: data.fileSize,
    };

    console.log(`Created package:`, packageFile);

    setIsBuilt(true);
    return packageFile;
  };

  return { createPackage, isBuilding, isBuilt };
};
