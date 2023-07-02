import { useContext, useState, ChangeEvent, useEffect } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import * as _ from 'lodash';
import { DownloaderFileDto } from '@bella/dto';
import VersionMenuSection from '../components/main-page/sections/version-menu-section';
import LinearProgressWithLabel from '../components/single/linear-progress-with-label';
import VersionSummary from '../components/main-page/sections/version-summary';
import { SettingsContext, SettingsContextValue } from '../settings/settings';
import FileTableV2Container from '../components/combined/files-table-v2';
import NoVersionModal from '../components/single/no-version-modal';
import { Copyright } from '../components/single/copyright';
import { DownloaderContext } from '../components/context';

function DashboardContent() {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);
  const { isDownloading, downloadingProgress, isSameVersion, preparedFiles, currentVersion } =
    useContext(DownloaderContext);

  const [choseFilesOpen, setChoseFilesOpen] = useState<boolean>(false);
  const [filesToDownload, setFilesToDownload] = useState<DownloaderFileDto[]>([]);

  const toggleFileToDownload = (event: ChangeEvent<HTMLInputElement>, file: DownloaderFileDto) => {
    event.preventDefault();

    _.includes(filesToDownload, file)
      ? setFilesToDownload(filesToDownload.filter((f) => f.id !== file.id))
      : setFilesToDownload([...filesToDownload, file]);
  };

  const toggleFileContainer = () => setChoseFilesOpen((prev) => !prev);

  useEffect(() => {
    setFilesToDownload([...preparedFiles]);
  }, [preparedFiles]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        marginTop: 'auto',
        marginBottom: 'auto',
      }}>
      {settings?.version?.currentVersion?.major === 0 && <NoVersionModal />}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <VersionSummary isSameVersion={isSameVersion} preparedFiles={preparedFiles} currentVersion={currentVersion} />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <VersionMenuSection
            isSameVersion={isSameVersion}
            toggleFileContainer={toggleFileContainer}
            filesToDownload={filesToDownload}
          />
        </Grid>

        <Grid item xs={12}>
          {choseFilesOpen && (
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1rem',
              }}>
              {preparedFiles?.length > 0 ? (
                <FileTableV2Container
                  filesdto={preparedFiles}
                  filesToDownload={filesToDownload}
                  setFilesToDownload={setFilesToDownload}
                  toggleFileToDownload={toggleFileToDownload}
                />
              ) : (
                <>Brak plików do pobrania</>
              )}
            </Paper>
          )}
          {isDownloading && (
            <LinearProgressWithLabel
              progressBarProps={{
                variant: 'determinate',
                value: downloadingProgress,
              }}
              value={downloadingProgress}
              label="Pobieram pliki..."
            />
          )}
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default function MainPage() {
  return <DashboardContent />;
}
