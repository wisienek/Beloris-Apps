import * as React from 'react';

import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material';
import Title from '../single/title';
import { FileUploadDto, VersionDto } from '@bella/dto';
import CurrentVersionCheckbox from '../single/current-version-checkbox';
import { ErrorSeverity } from '../single/error-message';
import { ErrorContext } from './error-box';
import TransferList from '../single/transfer-list';
import Tooltip from '../single/tooltip';

interface VersionSelectorArgs {
  version: Record<'major' | 'minor', number>;
  handleChange: (event: any, version: 'major' | 'minor') => void;
  versionHistory: VersionDto[] | undefined;
  currentVersion: VersionDto | undefined;
  isCurrentVersion: boolean;
  handleCurrentVersionChange: () => void;
}

const VersionSelector = ({
  version,
  versionHistory,
  currentVersion,
  handleChange,
  isCurrentVersion,
  handleCurrentVersionChange,
}: VersionSelectorArgs) => {
  const theme = useTheme();

  const [isSameVersion, setIsSameVersion] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (version && versionHistory) {
      const same = versionHistory.some(
        (v) => v?.minor === version?.minor && v?.major === version?.major,
      );

      isSameVersion !== same && setIsSameVersion(same);
    }
  }, [version, versionHistory]);

  return (
    <>
      <Title>Wybierz wersję</Title>
      <Typography variant="subtitle1" gutterBottom>
        Aktualna wersja:{' '}
        <b>{`${currentVersion?.major}.${currentVersion?.minor}`}</b>
      </Typography>

      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="bigv">Główna</InputLabel>
          <OutlinedInput
            type="number"
            id="bigv"
            placeholder={`${currentVersion?.major}`}
            value={version?.major}
            onChange={(e) => handleChange(e, 'major')}
            startAdornment={<InputAdornment position="start">V</InputAdornment>}
            label="Główna"
          />
        </FormControl>

        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="lilv">mała</InputLabel>
          <OutlinedInput
            type="number"
            id="lilv"
            placeholder={`${currentVersion?.minor}`}
            value={version?.minor}
            onChange={(e) => handleChange(e, 'minor')}
            startAdornment={<InputAdornment position="start">v</InputAdornment>}
            label="mała"
          />
        </FormControl>
      </Box>

      <CurrentVersionCheckbox
        currentVersion={currentVersion}
        selectedVersion={version}
        isCurrentVersion={isCurrentVersion}
        handleCurrentVersionChange={handleCurrentVersionChange}
      />

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: isSameVersion
            ? theme.palette.success.main
            : theme.palette.warning.main,
        }}
      >
        {isSameVersion
          ? 'Edytowanie istniejącej wersji'
          : 'Stworzenie nowej wersji'}
      </Typography>
    </>
  );
};

interface UploaderWizardArgs {
  version: Record<'major' | 'minor', number>;
  isPackage: boolean;
  files: FileUploadDto[];
  setFiles: React.Dispatch<React.SetStateAction<FileUploadDto[]>>;
}

const UploaderWizard = ({
  isPackage,
  files,
  setFiles,
  version,
}: UploaderWizardArgs) => {
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

    const { error } = await window.api.files.buildModpackPackage(version.major);
    setIsBuilding(false);

    if (error) {
      addError(ErrorSeverity.ERROR, error.message, false);
      return;
    }

    addError(ErrorSeverity.SUCCESS, `Zbudowano paczkę!`, true);
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

export { VersionSelectorArgs, UploaderWizardArgs };
export { VersionSelector, UploaderWizard };
