import * as React from 'react';
import axios from 'axios';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { Box, Button, Zoom } from '@mui/material';

// import { UploadPackageInfo } from '@bella/dto';

import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';
import Title from '../single/title';
import Tooltip from '../single/tooltip';
import Checklist, { CheckListTask } from '../combined/check-list';
import { ApiRoutes } from '../../api/api-routes.enum';

const UploaderWizard = () => {
  const { version, isPackage, files } =
    React.useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const [sending, setSending] = React.useState<boolean>(false);
  const [toDo, setTodo] = React.useState<string[]>([]);

  const reVerify = () => {
    const newTodo = [...toDo];

    if (
      isNaN(version?.major) ||
      version?.major === undefined ||
      version.major === 0 ||
      isNaN(version?.minor)
    )
      newTodo.push(`Musisz ustalić poprawnå wersję!`);

    if (!isPackage && files.length === 0)
      newTodo.push(`Brak plików do przesłania!`);

    console.log(newTodo);
    setTodo(newTodo);
  };

  const getTasks = (): CheckListTask[] => {
    return [
      {
        name: 'wersja',
        label: 'Wybrana wersja',
        checked:
          !isNaN(version.major) && !isNaN(version.minor) && version.major > 0,
      },
      {
        name: 'pliki',
        label: 'Przesłane pliki',
        checked: isPackage ? true : files?.length > 0,
      },
      {
        name: 'zmiany',
        label: 'Wprowadzone zmiany',
        checked: isPackage,
      },
    ];
  };

  const uploadFiles = async () => {
    setSending(true);

    if (isPackage) {
      const packageInfo = files[0];
      if (!('hash' in packageInfo)) {
        console.error(`Package info is not instance of UploadPackageInfo`);

        setSending(false);
        return;
      }

      try {
        const uploadedInfo = await axios({
          method: 'post',
          url: ApiRoutes.PACKAGE_UPLOAD(version.major, version.minor),
          data: packageInfo,
        });

        console.log(`Created package data: `, uploadedInfo);

        // upload package file
      } catch (error) {
        console.error(error);
      }

      setSending(false);
    }
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
          onClick={() => uploadFiles()}
        >
          {sending ? 'Przesyłam zmiany...' : 'Prześlij zmiany'}
        </Button>
      </Tooltip>
    </>
  );
};

export default UploaderWizard;
