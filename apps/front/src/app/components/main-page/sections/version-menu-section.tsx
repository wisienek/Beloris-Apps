import { Paper } from '@mui/material';
import { DownloaderFileDto } from '@bella/dto';
import VersionMenu from '../../combined/version-menu';
import Title from '../../single/title';

export interface VersionMenuSectionArgs {
  isSameVersion: boolean;
  toggleFileContainer: () => void;
  filesToDownload: DownloaderFileDto[];
}

const VersionMenuSection = (data: VersionMenuSectionArgs) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
      <Title>Menu wersji</Title>

      <br />

      <VersionMenu
        chooserToggle={data.toggleFileContainer}
        isSameVersion={data.isSameVersion}
        filesToDownload={data.filesToDownload}
      />
    </Paper>
  );
};

export default VersionMenuSection;
