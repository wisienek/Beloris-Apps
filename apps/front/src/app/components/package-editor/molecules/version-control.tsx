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
} from '@mui/material';
import AntSwitch from '../../single/ant-switch';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../sections/package-editor-state';

const VersionControl = () => {
  const {
    version,
    currentVersion,
    handleVersionChange,
    handleVersionSelect,
    versionHistory,
  } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [newVersion, setNewVersion] = useState<boolean>(false);

  return (
    <>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>Istniejąca wersja</Typography>
        <AntSwitch
          defaultChecked={newVersion}
          onChange={() => setNewVersion(!newVersion)}
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
                placeholder={`${currentVersion?.major ?? 0}`}
                value={version?.major ?? 0}
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
                placeholder={`${currentVersion?.minor ?? 0}`}
                value={version?.minor ?? 0}
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
    </>
  );
};

export default VersionControl;
