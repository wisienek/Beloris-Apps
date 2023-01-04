import { FetchResult } from 'react-fetch-hook';
import { Paper } from '@mui/material';
import { useContext } from 'react';
import { FileListDto } from '@bella/dto';
import VersionMenuLoader from '../molecules/version-menu-loader';
import VersionDetails from '../../combined/version-details';
import Title from '../../single/title';
import {
  SettingsContext,
  SettingsContextValue,
} from '../../../settings/settings';

export interface VersionSummaryArgs {
  filesToDownloadFetch: FetchResult<FileListDto>;
  isSameVersion: boolean;
}

const VersionSummary = (data: VersionSummaryArgs) => {
  const { settings } = useContext<SettingsContextValue>(SettingsContext);

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {data.filesToDownloadFetch.isLoading || true ? (
          <VersionMenuLoader />
        ) : (
          <></>
        )}

        {data.filesToDownloadFetch.data ? (
          <>
            <Title>Podsumowanie wersji serwerowej</Title>
            <VersionDetails
              isLoading={data.filesToDownloadFetch.isLoading}
              error={data.filesToDownloadFetch?.error}
              fetchedVersion={data.filesToDownloadFetch.data.version}
              fetchedFilesToDownload={data.filesToDownloadFetch.data.files}
              downloadedVersion={settings?.version?.currentVersion}
              isSameVersion={data.isSameVersion}
            />
          </>
        ) : (
          <></>
        )}

        {data.filesToDownloadFetch?.error ? <></> : <></>}
      </Paper>
    </>
  );
};
export default VersionSummary;
