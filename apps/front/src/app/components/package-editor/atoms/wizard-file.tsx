import { FileUploadDto, UploadPackageInfo } from '@bella/dto';
import { Box, CardHeader, Grid, Typography } from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

import { AllowedFileSizes } from '@bella/data';

import { CustomLinearProgress } from '../../single/linear-progress-with-label';
import { fileSizeFormat } from '../../../utils/number-format';
import WizardFileControls from './wizard-file-controls';

export interface WizardFileArgs {
  file: FileUploadDto | UploadPackageInfo;
}

// TODO: add normal file support
const WizardFile = ({ file }: WizardFileArgs) => {
  const isPackageFile = 'hash' in file;

  return (
    <Grid item>
      <Box>
        <CardHeader
          sx={{
            px: 0,
            pt: 0,
          }}
          avatar={<DriveFolderUploadIcon />}
          title={`${isPackageFile ? `Paczka` : `Plik`} ${file.name}`}
          titleTypographyProps={{
            variant: 'h5',
            color: 'textPrimary',
          }}
        />
        {isPackageFile ? (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Waga paczki:{' '}
              <Typography
                variant="body2"
                paragraph={false}
                noWrap={true}
                sx={file.fileSize > AllowedFileSizes.bundle ? { color: 'red' } : {}}
              >
                {fileSizeFormat(file.fileSize)} / {' ' + fileSizeFormat(AllowedFileSizes.bundle)}
              </Typography>
            </Typography>
            <CustomLinearProgress
              color="primary"
              variant="determinate"
              value={Math.min(Math.round((file.fileSize / AllowedFileSizes.bundle) * 100), 100)}
            />
          </Box>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <WizardFileControls file={file} isPackageFile={isPackageFile} deleteSelection={() => null} />
        </Box>
      </Box>
    </Grid>
  );
};

export default WizardFile;
