import * as React from 'react';

import { Button, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

import { UserSettings } from '@bella/schema';

export interface VersionMenuArgs {
  isLoading: boolean;
  chooserToggle: () => void;
  isSameVersion: boolean;
  settings: UserSettings;
}

const VersionMenu = ({
  settings,
  isLoading,
  chooserToggle,
  isSameVersion,
}: VersionMenuArgs) => {
  return (
    <Grid container direction="column" spacing={2} columns={1}>
      <Grid item alignItems="center" justifyContent="center">
        {settings?.downloadTo?.modpackFolder &&
        settings?.downloadTo?.mcFolder ? (
          <Button
            variant="contained"
            color="success"
            disabled={isLoading || isSameVersion}
            fullWidth
          >
            Pobierz
          </Button>
        ) : (
          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="error" fullWidth>
              Ustaw foldery
            </Button>
          </Link>
        )}
      </Grid>
      <Grid item alignItems="center" justifyContent="center">
        <Button
          startIcon={<SettingsIcon />}
          variant="contained"
          color="secondary"
          disabled={
            isLoading ||
            isSameVersion ||
            !(
              settings?.downloadTo?.modpackFolder ||
              settings?.downloadTo?.mcFolder
            )
          }
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
