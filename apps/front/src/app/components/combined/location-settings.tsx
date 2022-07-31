import * as React from 'react';
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Typography,
} from '@mui/material';
import OutlinedInputWrapper from '../single/OutlinedInputWrapper';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

export interface LocationSettingsArgs {
  id: string;
  label: React.ReactNode | string;
  placeholder: string;
  value: string;
  upload: (event: any, id: string) => void;
}

const LocationSettings = (args: LocationSettingsArgs) => {
  return (
    <>
      <Grid item sx={{ position: 'relative' }}>
        <FormControl variant="outlined" fullWidth>
          <Typography variant="subtitle1">{args.label}</Typography>
          <OutlinedInputWrapper
            disabled
            id={args.id}
            name={args.id}
            type="text"
            placeholder={args.placeholder}
            value={args.value}
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => args.upload(null, args.id)}
                >
                  <DriveFileMoveIcon />
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
    </>
  );
};

export default LocationSettings;
