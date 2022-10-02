import * as React from 'react';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { Box, Button, Zoom } from '@mui/material';

import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';
import Title from '../single/title';
import Tooltip from '../single/tooltip';
import Checklist, { CheckListContent } from '../combined/check-list';

const content: CheckListContent = {
  header: 'Check-lista',
  icon: <AssignmentTwoToneIcon />,
  tasks: [
    {
      name: 'wersja',
      label: 'Wybrana wersja',
      checked: false,
    },
    {
      name: 'pliki',
      label: 'Przesłane pliki',
      checked: false,
    },
    {
      name: 'zmiany',
      label: 'Wprowadzone zmiany',
      checked: false,
    },
  ],
};

const UploaderWizard = () => {
  const { version, isPackage, files } =
    React.useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [sending, setSending] = React.useState<boolean>(false);
  const [toDo, setTodo] = React.useState<string[]>([]);

  const reVerify = () => {
    const newTodo = [...toDo];

    if (!version.major || !version.minor)
      newTodo.push(`Musisz ustalić wersję!`);

    if (version.major <= 0 || version.minor <= 0)
      newTodo.push(`Wersja duża lub mała nie może być mniejsza niż 0`);

    if (!isPackage && files.length === 0)
      newTodo.push(`Brak plików do przesłania!`);

    setTodo(newTodo);
  };

  React.useEffect(() => {
    reVerify();
  }, [version, isPackage, files]);

  return (
    <>
      <Title>Podsumowanie {isPackage ? 'Paczki' : 'Plików'}</Title>

      <Box
        sx={{
          width: '100%',
          pb: 2,
        }}
      >
        <Checklist contents={[content]} />
      </Box>

      <Tooltip
        title="Wysyła info i pliki do serwera"
        arrow
        TransitionComponent={Zoom}
        placement="right"
      >
        <Button
          variant="contained"
          size="small"
          disabled={toDo.length > 0 || sending}
          onClick={() => setSending(!sending)}
        >
          Prześlij zmiany
        </Button>
      </Tooltip>
    </>
  );
};

export default UploaderWizard;
