import { FileUploadDto, UploadPackageInfo } from '@bella/dto';
import {
  Box,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import * as React from 'react';
import { CustomLinearProgress } from '../../single/linear-progress-with-label';

export interface WizardFileArgs {
  file: FileUploadDto | UploadPackageInfo;
}

// TODO: style
const WizardFile = ({ file }: WizardFileArgs) => {
  const isPackageFile = 'hash' in file;
  const theme = useTheme();

  return (
    <Grid item xs={12} md={4}>
      <Box>
        <CardHeader
          sx={{
            px: 0,
            pt: 0,
          }}
          avatar={<DriveFolderUploadIcon />}
          title={isPackageFile ? `Paczka` : `Plik`}
          titleTypographyProps={{
            variant: 'h5',
            color: 'textPrimary',
          }}
        />
        {isPackageFile ? (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Waga paczki:
              <Typography color="black">
                <b>{(file.fileSize / 1024).toPrecision(2)} mb /100 mb</b>
              </Typography>
            </Typography>
            <CustomLinearProgress
              color="primary"
              variant="determinate"
              value={file.fileSize}
            />
          </Box>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Tooltip arrow title="View project calendar" placement="top">
              <IconButton
                size="small"
                color="secondary"
                sx={{
                  ml: 0.5,
                }}
              >
                icon 1
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Mark project as favourite" placement="top">
              <IconButton
                size="small"
                sx={{
                  color: `${theme.colors.warning.main}`,
                  ml: 0.5,
                }}
              >
                icon 1
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default WizardFile;
