import * as React from 'react';

import { Button, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export interface VersionMenuArgs {
  isLoading: boolean;
  chooserToggle: () => void;
  isSameVersion: boolean;
}

const VersionMenu = ({
  isLoading,
  chooserToggle,
  isSameVersion,
}: VersionMenuArgs) => {
  return (
    <Grid container direction="column" spacing={2} columns={1}>
      <Grid item alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          color="success"
          disabled={isLoading || isSameVersion}
          fullWidth
        >
          Pobierz
        </Button>
      </Grid>
      <Grid item alignItems="center" justifyContent="center">
        <Button
          startIcon={<SettingsIcon />}
          variant="contained"
          color="secondary"
          disabled={isLoading || isSameVersion}
          fullWidth
          onClick={chooserToggle}
        >
          Edytuj pliki
        </Button>
      </Grid>
    </Grid>
  );
};

export default VersionMenu;
