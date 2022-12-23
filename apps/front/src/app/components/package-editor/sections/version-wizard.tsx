import { useContext, useState } from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CurrentVersionCheckbox from '../../single/current-version-checkbox';
import AntSwitch from '../../single/ant-switch';
import { useSameVersion } from '../hooks';
import Title from '../../single/title';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';

const VersionSelector = () => {
  const {
    version,
    versionHistory,
    currentVersion,
    isCurrentVersion,
    handleVersionChange,
    handleVersionSelect,
    handleCurrentVersionChange,
  } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { isSameVersion } = useSameVersion();

  // FIXME
  const [newVersion, setNewVersion] = useState<boolean>(false);

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

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>Istniejąca wersja</Typography>
        <AntSwitch
          defaultChecked={newVersion}
          onChange={(e) => setNewVersion(!newVersion)}
          inputProps={{ 'aria-label': 'ant switch' }}
        />
        <Typography>Nowa wersja</Typography>
      </Stack>

      <Box
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        {newVersion ? (
          <>
            <FormControl sx={{ m: 2 }}>
              <InputLabel htmlFor="bigv">Główna</InputLabel>
              <OutlinedInput
                type="number"
                id="bigv"
                placeholder={`${currentVersion?.major}`}
                value={version?.major}
                onChange={(e) => handleVersionChange(e, 'major')}
                startAdornment={
                  <InputAdornment position="start">V</InputAdornment>
                }
                label="Główna"
              />
            </FormControl>

            <FormControl sx={{ m: 2 }}>
              <InputLabel htmlFor="lilv">mała</InputLabel>
              <OutlinedInput
                type="number"
                id="lilv"
                placeholder={`${currentVersion?.minor}`}
                value={version?.minor}
                onChange={(e) => handleVersionChange(e, 'minor')}
                startAdornment={
                  <InputAdornment position="start">v</InputAdornment>
                }
                label="mała"
              />
            </FormControl>
          </>
        ) : (
          <>
            <FormControl sx={{ m: 2, width: '50%' }}>
              <InputLabel id="select-existing-version-label">Wersja</InputLabel>
              <Select
                labelId="select-existing-version-label"
                id="select-existing-version"
                value={`${version?.major}.${version?.minor}`}
                label="Wersja"
                onChange={(e) => handleVersionSelect(e)}
              >
                {(versionHistory ?? []).map((v) => (
                  <MenuItem value={`${v.major}.${v.minor}`}>
                    {v.major}.{v.minor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
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
