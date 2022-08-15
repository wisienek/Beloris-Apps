import * as React from 'react';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useTheme,
} from '@mui/material';
import Title from '../single/title';
import { VersionDto } from '@bella/dto';
import CurrentVersionCheckbox from '../single/current-version-checkbox';

export interface VersionSelectorArgs {
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

  const checkMainVersion = () =>
    version?.major === currentVersion?.major &&
    version?.minor === currentVersion?.minor;

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

export { VersionSelector };
