import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { SettingsContext, SettingsContextValue } from '../../settings/settings';

export interface VersionMenuArgs {
  isLoading: boolean;
  chooserToggle: () => void;
  isSameVersion: boolean;
}

const VersionMenu = ({ isLoading, chooserToggle, isSameVersion }: VersionMenuArgs) => {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);

  return (
    <Grid container direction="column" spacing={2} columns={1}>
      <Grid item alignItems="center" justifyContent="center">
        {settings?.downloadTo?.modpackFolder && settings?.downloadTo?.mcFolder ? (
          <Button
            variant="contained"
            color="success"
            disabled={isLoading || isSameVersion}
            fullWidth
            // TODO: onClick -> download files
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
            isLoading || isSameVersion || !(settings?.downloadTo?.modpackFolder || settings?.downloadTo?.mcFolder)
          }
          fullWidth
          onClick={chooserToggle}>
          Edytuj pliki
        </Button>
      </Grid>
    </Grid>
  );
};

export default VersionMenu;
