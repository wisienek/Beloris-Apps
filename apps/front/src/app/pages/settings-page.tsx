import { Grid } from '@mui/material';
import { useContext } from 'react';
import { IpcFileChoseEnum } from '@bella/enums';
import LocationSettings from '../components/combined/location-settings';
import { ErrorSeverity } from '../components/single/error-message';
import { ErrorContext } from '../components/combined/error-box';
import DiscordLogin from '../components/single/discord-login';
import { SettingsContext } from '../settings/settings';
import Title from '../components/single/title';
import Label from '../components/single/label';

const SettingsPage = () => {
  const { settings, saveSettings } = useContext(SettingsContext);
  const { addError } = useContext(ErrorContext);

  const handleFile = async (id: string) => {
    const response = await window.api.files.openFileDialog({
      fileType: IpcFileChoseEnum.DIRECTORIES,
    });

    if (response.failed) {
      addError(ErrorSeverity.WARNING, response?.error?.message ?? `Coś poszło nie tak przy wybieraniu folderu!`);
      return;
    }

    const downloadTo = Object.assign(
      { ...settings?.downloadTo },
      id === 'mainLocation' && { mcFolder: response.data },
      id === 'modpackLocation' && { modpackFolder: response.data },
    );

    saveSettings({ downloadTo });
  };

  const resetSettings = (id: string) => {
    const downloadTo = Object.assign(
      { ...settings?.downloadTo },
      id === 'mainLocation' && { mcFolder: null },
      id === 'modpackLocation' && { modpackFolder: null },
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
            reset={resetSettings}
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
            reset={resetSettings}
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
