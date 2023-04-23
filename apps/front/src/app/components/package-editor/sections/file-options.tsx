import { Box, Button, Zoom } from '@mui/material';
import { useContext, useEffect } from 'react';
import { PackageEditorStateContext, PackageEditorStateValue } from './package-editor.state';
import FileOptionsTableContainer from '../atoms/file-options-table';
import { useFiles, usePackageCreator } from '../hooks';
import Tooltip from '../../single/tooltip';

const FileOptions = () => {
  const { isPackage } = useContext<PackageEditorStateValue>(PackageEditorStateContext);
  const { intelligentSearch, versionedFiles, selectFile, editFile, finishEditingFiles, accepted } = useFiles();
  const { createPackage, isBuilding, isBuilt } = usePackageCreator();

  useEffect(() => {
    intelligentSearch();
  }, []);

  return isPackage ? (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Tooltip title="Buduje plik archiwum z obecnej paczki modów" arrow TransitionComponent={Zoom} placement="right">
        <Button variant="contained" size="small" disabled={isBuilding || isBuilt} onClick={() => createPackage()}>
          {isBuilding ? `Buduję paczkę...` : isBuilt ? `Zbudowano paczkę.` : `Zbuduj paczkę`}
        </Button>
      </Tooltip>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <FileOptionsTableContainer
        editFile={editFile}
        files={versionedFiles}
        selectFile={selectFile}
        stopActions={accepted}
      />
      <Button
        variant="contained"
        color="success"
        onClick={() => finishEditingFiles()}
        disabled={accepted}
        sx={{ mt: 2 }}
      >
        Zaakceptuj
      </Button>
    </Box>
  );
};

export default FileOptions;
