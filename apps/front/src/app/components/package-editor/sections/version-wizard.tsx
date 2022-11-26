import { useContext } from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useTheme,
} from '@mui/material';

import Title from '../../single/title';
import CurrentVersionCheckbox from '../../single/current-version-checkbox';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';
import { useSameVersion } from '../hooks';

const VersionSelector = () => {
  const {
    version,
    currentVersion,
    handleVersionChange,
    isCurrentVersion,
    handleCurrentVersionChange,
  } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { isSameVersion } = useSameVersion();

  const theme = useTheme();

  return (
    <>
      <Title>Wybierz wersję</Title>
      <Typography variant="subtitle1" gutterBottom>
        Aktualna wersja:{' '}
        <b>{`${currentVersion?.major ?? 'xx'}.${
          currentVersion?.minor ?? 'xx'
        }`}</b>
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
            onChange={(e) => handleVersionChange(e, 'major')}
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
            onChange={(e) => handleVersionChange(e, 'minor')}
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

export default VersionSelector;
