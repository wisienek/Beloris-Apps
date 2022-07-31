import * as React from 'react';
import useFetch from 'react-fetch-hook';
import * as _ from 'lodash';

import { Skeleton, Container, Grid, Paper } from '@mui/material';

import { DownloaderFileDto, VersionDto } from '@bella/shared';

import LinearProgressWithLabel from '../components/single/linear-progress-with-label';
import VersionDetails from '../components/combined/version-details';
import VersionMenu from '../components/combined/version-menu';
import { Copyright } from '../components/single/copyright';
import Title from '../components/single/title';
import { ApiRoutes } from '../api/api-routes.enum';
import FileTableV2Container from '../components/combined/files-table-v2';
import { SettingsContext, SettingsContextValue } from '../settings/settings';

function DashboardContent() {
  const { settings } = React.useContext<SettingsContextValue>(SettingsContext);
  const [choseFilesOpen, setChoseFilesOpen] = React.useState<boolean>(false);
  const [filesToDownload, setFilesToDownload] = React.useState<
    DownloaderFileDto[]
  >([]);
  const versionFetch = useFetch<VersionDto>(ApiRoutes.VERSION);

  const isSameVersion = React.useMemo<boolean>(() => {
    if (!settings?.version?.currentVersion || !versionFetch?.data) return false;

    return (
      settings.version.currentVersion.minor === versionFetch.data.minor &&
      settings.version.currentVersion.major === versionFetch.data.major
    );
  }, [settings?.version?.currentVersion, versionFetch.data]);

  const toggleFileToDownload = (
    event: React.ChangeEvent<HTMLInputElement>,
    file: DownloaderFileDto,
  ) => {
    event.preventDefault();

    _.includes(filesToDownload, file)
      ? setFilesToDownload(filesToDownload.filter((f) => f.uuid !== file.uuid))
      : setFilesToDownload([...filesToDownload, file]);
  };

  const toggleFileContainer = () => setChoseFilesOpen(!choseFilesOpen);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        marginTop: 'auto',
        marginBottom: 'auto',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {versionFetch.isLoading && <Skeleton animation="wave" />}
            {versionFetch.data && (
              <>
                <Title>Podsumowanie wersji serwerowej</Title>
                <VersionDetails
                  fetchedVersion={versionFetch.data}
                  downloadedVersion={settings?.version?.currentVersion}
                  isSameVersion={isSameVersion}
                />
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Title>Menu wersji</Title>
            {versionFetch.isLoading && <Skeleton animation="wave" />}
            <br />
            <VersionMenu
              isLoading={versionFetch.isLoading}
              chooserToggle={toggleFileContainer}
              isSameVersion={isSameVersion}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {choseFilesOpen && (
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '1rem',
              }}
            >
              {versionFetch.isLoading ? (
                <Skeleton variant="rectangular" />
              ) : (
                <>
                  <FileTableV2Container
                    version={versionFetch.data}
                    filesToDownload={filesToDownload}
                    setFilesToDownload={setFilesToDownload}
                    toggleFileToDownload={toggleFileToDownload}
                  />
                </>
              )}
            </Paper>
          )}
          <LinearProgressWithLabel variant="determinate" value={50} />
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </Container>
  );
}

export default function MainPage() {
  return <DashboardContent />;
}
