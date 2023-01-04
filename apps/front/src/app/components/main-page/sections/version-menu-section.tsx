import { Paper, Skeleton } from '@mui/material';
import { FetchResult } from 'react-fetch-hook';
import { FileListDto } from '@bella/dto';
import VersionMenu from '../../combined/version-menu';
import Title from '../../single/title';

export interface VersionMenuSectionArgs {
  filesToDownloadFetch: FetchResult<FileListDto>;
  isSameVersion: boolean;
  toggleFileContainer: () => void;
}

const VersionMenuSection = (data: VersionMenuSectionArgs) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Title>Menu wersji</Title>

      {data.filesToDownloadFetch.isLoading && <Skeleton animation="wave" />}
      <br />

      <VersionMenu
        isLoading={data.filesToDownloadFetch.isLoading}
        chooserToggle={data.toggleFileContainer}
        isSameVersion={data.isSameVersion}
      />
    </Paper>
  );
};

export default VersionMenuSection;
