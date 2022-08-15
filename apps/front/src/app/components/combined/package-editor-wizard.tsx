import * as React from 'react';

import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Title from '../single/title';

const VersionSelector = () => {
  const [version, setVersion] = React.useState<
    Record<'major' | 'minor', number>
  >({ major: 0, minor: 0 });

  const handleChange = (e: any, type: 'major' | 'minor') => {
    const newValue = parseInt(e.target.value);
    if (newValue < 0) return;

    setVersion({ ...version, [type]: newValue });
  };

  return (
    <>
      <Title>Wybierz wersję</Title>

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
            value={version.major}
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
            value={version.minor}
            onChange={(e) => handleChange(e, 'minor')}
            startAdornment={<InputAdornment position="start">v</InputAdornment>}
            label="mała"
          />
        </FormControl>
      </Box>
    </>
  );
};

export { VersionSelector };
