import { useContext } from 'react';
import { Typography, useTheme } from '@mui/material';
import CurrentVersionCheckbox from '../../single/current-version-checkbox';
import VersionControl from '../molecules/version-control';
import { useSameVersion } from '../hooks';
import Title from '../../single/title';
import {
  PackageEditorStateContext,
  PackageEditorStateValue,
} from './package-editor-state';

const VersionSelector = () => {
  const {
    version,
    currentVersion,
    isCurrentVersion,
    handleCurrentVersionChange,
  } = useContext<PackageEditorStateValue>(PackageEditorStateContext);

  const { isSameVersion } = useSameVersion();

  const theme = useTheme();

  return (
    <>
      <Title>Wybierz wersję</Title>
      <Typography variant="subtitle1" gutterBottom>
        Aktualna wersja:{' '}
        <b>{`${currentVersion?.major ?? 'xx'}.${
          currentVersion?.minor ?? 'xx'
        }`}</b>
      </Typography>

      <VersionControl />

      <CurrentVersionCheckbox
        currentVersion={currentVersion}
        selectedVersion={version}
        isCurrentVersion={isCurrentVersion}
        handleCurrentVersionChange={handleCurrentVersionChange}
      />

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{
          color: isSameVersion
            ? theme.palette.success.main
            : theme.palette.warning.main,
        }}
      >
        {isSameVersion
          ? 'Edytowanie istniejącej wersji'
          : 'Stworzenie nowej wersji'}
      </Typography>
    </>
  );
};

export default VersionSelector;
