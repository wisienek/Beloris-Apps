import { Paper } from '@mui/material';
import { useContext } from 'react';
import { DownloaderFileDto, VersionDto } from '@bella/dto';
import { SettingsContext, SettingsContextValue } from '../../../settings/settings';
import VersionDetails from '../../combined/version-details';
import Title from '../../single/title';

export interface VersionSummaryArgs {
  preparedFiles: DownloaderFileDto[];
  isSameVersion: boolean;
  currentVersion: VersionDto;
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
        }}>
        <Title>Podsumowanie wersji serwerowej</Title>
        <VersionDetails
          fetchedVersion={data.currentVersion}
          fetchedFilesToDownload={data.preparedFiles}
          downloadedVersion={settings?.version?.currentVersion}
          isSameVersion={data.isSameVersion}
        />
      </Paper>
    </>
  );
};
export default VersionSummary;
