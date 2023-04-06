import { useContext } from 'react';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { Box, Button, Zoom } from '@mui/material';
import { PackageEditorStateContext, PackageEditorStateValue } from './package-editor-state';
import Checklist, { CheckListTask } from '../../combined/check-list';
import { useVerifyPackage, useUploadFiles } from '../hooks';
import Tooltip from '../../single/tooltip';
import Title from '../../single/title';

const UploaderWizard = () => {
  const { version, isPackage, files } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { toDo } = useVerifyPackage();
  const { sending, sendingProgress, uploadFiles, sent } = useUploadFiles();

  const getTasks = (): CheckListTask[] => {
    return [
      {
        name: 'wersja',
        label: 'Wybrana wersja',
        checked: !isNaN(version.major) && !isNaN(version.minor) && version.major > 0,
      },
      {
        name: 'pliki',
        label: 'Przesłane pliki',
        checked: isPackage ? true : files?.length > 0,
      },
      {
        name: 'zmiany',
        label: 'Wprowadzone zmiany',
        checked: true,
      },
    ];
  };

  return (
    <>
      <Title>Podsumowanie {isPackage ? 'Paczki' : 'Plików'}</Title>

      <Box
        sx={{
          width: '100%',
          pb: 2,
        }}
      >
        <Checklist
          contents={[
            {
              header: 'Check-lista',
              icon: <AssignmentTwoToneIcon />,
              tasks: getTasks(),
            },
          ]}
        />
      </Box>

      <Tooltip title="Wysyła info i pliki do serwera" arrow TransitionComponent={Zoom} placement="right">
        <Button
          variant="contained"
          size="small"
          disabled={toDo.length > 0 || sending || sent}
          onClick={() => uploadFiles()}
        >
          {sent ? 'Wysłane...' : sending ? 'Przesyłam zmiany...' : 'Prześlij zmiany'}
        </Button>
      </Tooltip>
    </>
  );
};

export default UploaderWizard;
