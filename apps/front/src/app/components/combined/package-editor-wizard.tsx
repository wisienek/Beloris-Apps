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
} from '@mui/material';
import Title from '../single/title';
import { FileUploadDto, VersionDto } from '@bella/dto';
import CurrentVersionCheckbox from '../single/current-version-checkbox';
import { ErrorSeverity } from '../single/error-message';
import { ErrorContext } from './error-box';
import { IpcFileChoseEnum } from '@bella/enums';

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
  isPackage: boolean;
}

const UploaderWizard = ({ isPackage }: UploaderWizardArgs) => {
  const { addError } = React.useContext(ErrorContext);
  const [uploaded, setUploaded] = React.useState<string>('');
  const [files, setFiles] = React.useState<FileUploadDto[]>([]);

  const upload = async (id: string) => {
    const { failed, data, error } = await window.api.files.openFileDialog({
      fileType:
        id === 'package'
          ? IpcFileChoseEnum.PACKAGE
          : IpcFileChoseEnum.VERSION_FILE,
    });

    if (failed) {
      addError(
        ErrorSeverity.WARNING,
        error?.message ?? `Coś poszło nie tak przy wybieraniu folderu!`,
      );
      return;
    }

    setUploaded(Array.isArray(data) ? data[0] : data);
  };

  const reset = (id: string) => {
    console.log(`Reseting package ${id}`);
  };

  const inteligentSearch = async () => {
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
  };

  React.useEffect(() => {
    console.log(`Fetched files`, files);
  }, [files]);

  return (
    <>
      <Title>Prześlij {isPackage ? 'Paczkę jar/zip/tar' : 'Plik'}</Title>

      <Button
        variant="contained"
        size="small"
        onClick={() => inteligentSearch()}
      >
        Inteligentne wyszukiwanie
      </Button>
    </>
  );
};

export { VersionSelectorArgs, UploaderWizardArgs };
export { VersionSelector, UploaderWizard };
