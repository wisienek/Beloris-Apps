import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { DownloaderFileDto } from '@bella/dto';
import { SettingsContext, SettingsContextValue } from '../../settings/settings';
import { DownloaderContext } from '../context';

export interface VersionMenuArgs {
  chooserToggle: () => void;
  isSameVersion: boolean;
  filesToDownload: DownloaderFileDto[];
}

const VersionMenu = ({ chooserToggle, isSameVersion, filesToDownload }: VersionMenuArgs) => {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);
  const { downloadFiles } = useContext(DownloaderContext);

  return (
    <Grid container direction="column" spacing={2} columns={1}>
      <Grid item alignItems="center" justifyContent="center">
        {settings?.downloadTo?.modpackFolder && settings?.downloadTo?.mcFolder ? (
          <Button
            variant="contained"
            color="success"
            disabled={isSameVersion}
            fullWidth
            onClick={() => downloadFiles(filesToDownload)}>
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
          disabled={isSameVersion || !(settings?.downloadTo?.modpackFolder || settings?.downloadTo?.mcFolder)}
          fullWidth
          onClick={chooserToggle}>
          Edytuj pliki
        </Button>
      </Grid>
    </Grid>
  );
};

export default VersionMenu;
