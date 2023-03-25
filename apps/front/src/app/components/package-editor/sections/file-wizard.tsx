import { Box, Button, Typography, useTheme, Zoom } from '@mui/material';
import { useContext } from 'react';
import { PackageEditorStateContext, PackageEditorStateValue } from './package-editor-state';
import { usePackageCreator, useFiles } from '../hooks';
import FileSelector from '../molecules/file-selector';
import FileMap from '../molecules/file-map';
import Tooltip from '../../single/tooltip';
import Title from '../../single/title';

const FileWizard = () => {
  const { isPackage, files } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { createPackage, isBuilding, isBuilt } = usePackageCreator();
  const { filesMap, intelligentSearch, setSelectedFiles, accept } = useFiles();

  const theme = useTheme();

  return (
    <>
      <Title>Wybierz pliki</Title>

      {isPackage ? (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Tooltip
            title="Buduje plik archiwum z obecnej paczki modów"
            arrow
            TransitionComponent={Zoom}
            placement="right"
          >
            <Button variant="contained" size="small" disabled={isBuilding || isBuilt} onClick={() => createPackage()}>
              {isBuilding ? `Buduję paczkę...` : isBuilt ? `Zbudowano paczkę.` : `Zbuduj paczkę`}
            </Button>
          </Tooltip>
        </Box>
      ) : (
        <>
          <Button variant="contained" size="small" onClick={() => intelligentSearch()}>
            Inteligentne wyszukiwanie
          </Button>
          <br />
          {files && (
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  color: theme.palette.warning.main,
                  textAlign: 'center',
                }}
              >
                Wybierz pliki, które przesłać
              </Typography>

              {Object.keys(filesMap).length > 0 ? (
                <FileSelector filesMap={filesMap} setSelectedFiles={setSelectedFiles} accept={accept} />
              ) : (
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    color: theme.palette.warning.main,
                  }}
                >
                  Brak plików w folderze!
                </Typography>
              )}
            </Box>
          )}
        </>
      )}

      {files?.length > 0 && isPackage ? <FileMap /> : <></>}
    </>
  );
};

export { FileWizard };
