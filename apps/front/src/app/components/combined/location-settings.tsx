import * as React from 'react';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  Zoom,
} from '@mui/material';
import OutlinedInputWrapper from '../single/outlined-input-wrapper';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '../single/tooltip';

export interface LocationSettingsArgs {
  id: string;
  label: React.ReactNode | string;
  placeholder?: string;
  value: string;
  upload: (id: string) => void;
  reset: (id: string) => void;
}

const LocationSettings = ({
  id,
  label,
  placeholder,
  value,
  upload,
  reset,
}: LocationSettingsArgs) => {
  return (
    <>
      <Grid item sx={{ position: 'relative' }}>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="subtitle1">{label}</Typography>
          <OutlinedInputWrapper
            disabled
            id={id}
            name={id}
            type="text"
            placeholder={placeholder}
            value={value}
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <Tooltip
                  title="Wyszukaj lokację"
                  arrow
                  TransitionComponent={Zoom}
                  placement="left"
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => upload(id)}
                  >
                    <DriveFileMoveIcon />
                  </Button>
                </Tooltip>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <Tooltip
                  title="Resetuj"
                  arrow
                  TransitionComponent={Zoom}
                  placement="top"
                >
                  <IconButton color="error" onClick={() => reset(id)}>
                    <RestartAltIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
    </>
  );
};

export default LocationSettings;
