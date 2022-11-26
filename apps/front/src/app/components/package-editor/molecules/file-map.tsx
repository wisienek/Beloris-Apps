import { Box, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import WizardFile from '../atoms/wizard-file';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from '../package-editor-state';

const FileMap = () => {
  const { files } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  return (
    <Box
      sx={{
        mt: 3,
        width: '100%',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h6">Wybrane pliki</Typography>
      </Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        {files.map((file) => (
          <WizardFile file={file} />
        ))}
      </Grid>
    </Box>
  );
};

export default FileMap;
