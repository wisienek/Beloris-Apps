import * as React from 'react';
import { Grid } from '@mui/material';

import Title from '../components/single/title';
import LocationSettings from '../components/combined/location-settings';
import Label from '../components/single/label';
import { SettingsContext } from '../settings/settings';
import { ErrorContext } from '../components/combined/error-box';
import { ErrorSeverity } from '../components/single/error-message';
import DiscordLogin from '../components/single/discord-login';

const SettingsPage = () => {
  const { settings, saveSettings } = React.useContext(SettingsContext);
  const { addError } = React.useContext(ErrorContext);

  const handleFile = async (e, id) => {
    const response = await window.api.settings.openFileDialog();

    if (response.failed) {
      addError(
        ErrorSeverity.WARNING,
        response?.error?.message ??
          `Coś poszło nie tak przy wybieraniu folderu!`,
      );
      return;
    }

    const downloadTo = Object.assign(
      { ...settings?.downloadTo },
      id === 'mainLocation' && { mcFolder: response.data },
      id === 'modpackLocation' && { modpackFolder: response.data },
    );

    saveSettings({ downloadTo });
  };

  return (
    <Grid
      container
      rowSpacing={1}
      columnSpacing={{ sm: 1, md: 1, lg: 2 }}
      columns={{ sm: 1, md: 1, lg: 2 }}
      justifyContent="space-around"
      alignItems="flex-start"
      sx={{
        backgroundColor: 'white',
        pt: '2vh',
      }}
    >
      <Grid item sx={{ width: '30%' }}>
        <Title>Ustawienia główne</Title>

        <Grid
          container
          columns={1}
          columnSpacing={3}
          spacing={3}
          flexDirection="column"
          alignItems="stretch"
          sx={{
            mt: 1,
          }}
        >
          <LocationSettings
            id="mainLocation"
            placeholder="/home/user/twoja/lokacja/.minecraft"
            value={settings?.downloadTo?.mcFolder ?? ''}
            upload={handleFile}
            label={
              <>
                Lokacja głównego folderu <Label>.minecraft</Label>
              </>
            }
          />

          <LocationSettings
            id="modpackLocation"
            placeholder="/.minecraft/modpacks/belorisRP"
            label="Lokacja modpacka"
            value={settings?.downloadTo?.modpackFolder ?? ''}
            upload={handleFile}
          />
        </Grid>
      </Grid>
      <Grid item sx={{ width: '30%' }}>
        <Title>Ustawienia personalne</Title>

        <Grid
          container
          columns={1}
          columnSpacing={3}
          spacing={3}
          flexDirection="column"
          alignItems="stretch"
          sx={{
            mt: 1,
          }}
        >
          <DiscordLogin />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SettingsPage;
