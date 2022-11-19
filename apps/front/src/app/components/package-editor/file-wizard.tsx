import * as React from 'react';
import { Button, Typography, useTheme, Zoom } from '@mui/material';

import { ErrorContext } from '../combined/error-box';
import { ErrorSeverity } from '../single/error-message';
import Title from '../single/title';
import Tooltip from '../single/tooltip';
import TransferList from '../single/transfer-list';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';

import { UploadPackageInfo } from '@bella/dto';

const FileWizard = () => {
  const { isPackage, files, setFiles, version } =
    React.useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const theme = useTheme();

  const { addError } = React.useContext(ErrorContext);
  const [filesMap, setFilesMap] = React.useState<Record<number, string>>({});
  const [selectedFiles, setSelectedFiles] = React.useState<number[]>([]);
  const [isBuilding, setIsBuilding] = React.useState<boolean>(false);

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
    setFilesMap(
      Object.fromEntries(
        new Map(filesFetch.data.map((f, i) => [i, f.savePath])),
      ),
    );
  };

  const createPackage = async () => {
    setIsBuilding(true);

    const { error, data } = await window.api.files.buildModpackPackage(
      version.major,
    );
    setIsBuilding(false);

    if (error) {
      addError(ErrorSeverity.ERROR, error.message, false);
      return;
    }

    addError(
      ErrorSeverity.SUCCESS,
      `Zbudowano paczkę: ${data.filePath}!`,
      true,
    );

    const packageFile: UploadPackageInfo = {
      name: data.name,
      required: true,
      savePath: '/',
      hash: data.hash,
      fileSize: data.fileSize,
    };

    setFiles([packageFile]);
  };

  const setSelected = () => {};

  return (
    <>
      <Title>Wybierz pliki</Title>

      {isPackage ? (
        <>
          <Tooltip
            title="Buduje plik archiwum z obecnej paczki modów"
            arrow
            TransitionComponent={Zoom}
            placement="right"
          >
            <Button
              variant="contained"
              size="small"
              disabled={isBuilding}
              onClick={() => createPackage()}
            >
              Zbuduj paczkę
            </Button>
          </Tooltip>

          {isBuilding && <>Buduje paczkę</>}
        </>
      ) : (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => intelligentSearch()}
          >
            Inteligentne wyszukiwanie
          </Button>
          <br />
          {files && (
            <>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  color: theme.palette.warning.main,
                }}
              >
                Wybierz pliki, które przesłać
              </Typography>
              {Object.keys(filesMap).length > 0 ? (
                <TransferList
                  allItems={filesMap}
                  selectedLeft={Object.keys(filesMap).map(Number)}
                  selectedRight={[]}
                  setParentRight={(numbers) => setSelectedFiles(numbers)}
                />
              ) : (
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    color: theme.palette.warning.main,
                  }}
                >
                  Brak plików w folderze!
                </Typography>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export { FileWizard };
