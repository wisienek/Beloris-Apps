import { useContext, useState, useMemo, ChangeEvent } from 'react';
import { Skeleton, Container, Grid, Paper } from '@mui/material';
import useFetch from 'react-fetch-hook';
import * as _ from 'lodash';
import { DownloaderFileDto, FileListDto } from '@bella/dto';
import { ApiRoutes } from '@bella/data';
import VersionMenuSection from '../components/main-page/sections/version-menu-section';
import LinearProgressWithLabel from '../components/single/linear-progress-with-label';
import VersionSummary from '../components/main-page/sections/version-summary';
import { SettingsContext, SettingsContextValue } from '../settings/settings';
import FileTableV2Container from '../components/combined/files-table-v2';
import NoVersionModal from '../components/single/no-version-modal';
import { Copyright } from '../components/single/copyright';

function DashboardContent() {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);
  const [choseFilesOpen, setChoseFilesOpen] = useState<boolean>(false);
  const [filesToDownload, setFilesToDownload] = useState<DownloaderFileDto[]>(
    [],
  );
  const filesToDownloadFetch = useFetch<FileListDto>(
    ApiRoutes.GET_UPDATE_FILES(
      settings?.version?.currentVersion?.major ?? 0,
      settings?.version?.currentVersion?.minor ?? 0,
    ),
    {
      depends: [!!settings],
    },
  );

  const isSameVersion = useMemo<boolean>(() => {
    if (
      !settings?.version?.currentVersion ||
      !filesToDownloadFetch?.data?.version
    )
      return false;

    return (
      settings.version.currentVersion.minor ===
        filesToDownloadFetch.data.version.minor &&
      settings.version.currentVersion.major ===
        filesToDownloadFetch.data.version.major
    );
  }, [settings?.version?.currentVersion, filesToDownloadFetch.data]);

  const toggleFileToDownload = (
    event: ChangeEvent<HTMLInputElement>,
    file: DownloaderFileDto,
  ) => {
    event.preventDefault();

    _.includes(filesToDownload, file)
      ? setFilesToDownload(filesToDownload.filter((f) => f.id !== file.id))
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
      {settings?.version?.currentVersion?.major === 0 && <NoVersionModal />}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <VersionSummary
            isSameVersion={isSameVersion}
            filesToDownloadFetch={filesToDownloadFetch}
          />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <VersionMenuSection
            isSameVersion={isSameVersion}
            filesToDownloadFetch={filesToDownloadFetch}
            toggleFileContainer={toggleFileContainer}
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
              }}
            >
              {filesToDownloadFetch.isLoading ? (
                <Skeleton variant="rectangular" />
              ) : (
                <>
                  <FileTableV2Container
                    filesdto={filesToDownloadFetch.data}
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
