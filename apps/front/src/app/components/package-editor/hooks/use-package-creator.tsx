import { useContext, useState } from 'react';
import { UploadPackageInfo } from '@bella/dto';
import { PackageEditorStateContext, PackageEditorStateValue } from '../sections/package-editor.state';
import { ErrorSeverity } from '../../single/error-message';
import { ErrorContext } from '../../combined/error-box';

export const usePackageCreator = () => {
  const { setFiles, version } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { addError } = useContext(ErrorContext);

  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isBuilt, setIsBuilt] = useState<boolean>(false);

  const createPackage = async () => {
    setIsBuilding(true);

    const { error, data } = await window.api.files.buildModpackPackage(version.major);
    setIsBuilding(false);

    if (error) {
      addError(ErrorSeverity.ERROR, error.message, false);
      setIsBuilt(false);
      return;
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
    setFiles([packageFile]);
  };

  return { createPackage, isBuilding, isBuilt };
};
