import { useContext } from 'react';
import { Box, Button, Grid, Typography, useTheme, Zoom } from '@mui/material';

import Title from '../../single/title';
import Tooltip from '../../single/tooltip';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';

import { usePackageCreator, useFiles } from '../hooks';
import FileMap from '../molecules/file-map';
import FileSelector from '../molecules/file-selector';

const FileWizard = () => {
  const { isPackage, files } = useContext<PackageEditorStateValue>(
    PackageEditorStateContext,
  );

  const { createPackage, isBuilding } = usePackageCreator();
  const { filesMap, intelligentSearch, setSelectedFiles, accept } = useFiles();

  const theme = useTheme();

  return (
    <>
      <Title>Wybierz pliki</Title>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        direction="column"
        sx={{ mt: 3 }}
      >
        {isPackage ? (
          <Box>
            <Tooltip
              title="Buduje plik archiwum z obecnej paczki modów"
              arrow
              TransitionComponent={Zoom}
              placement="right"
            >
              <Button
                variant="contained"
                size="small"
                disabled={isBuilding}
                onClick={() => createPackage()}
              >
                Zbuduj paczkę
              </Button>
            </Tooltip>

            {isBuilding && <>Buduje paczkę</>}
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => intelligentSearch()}
            >
              Inteligentne wyszukiwanie
            </Button>
            <br />
            {files && (
              <Box>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    color: theme.palette.warning.main,
                  }}
                >
                  Wybierz pliki, które przesłać
                </Typography>

                {Object.keys(filesMap).length > 0 ? (
                  <FileSelector
                    filesMap={filesMap}
                    setSelectedFiles={setSelectedFiles}
                    accept={accept}
                  />
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

        {files?.length > 0 && isPackage ? (
          <>
            <FileMap />
          </>
        ) : null}
      </Grid>
    </>
  );
};

export { FileWizard };
