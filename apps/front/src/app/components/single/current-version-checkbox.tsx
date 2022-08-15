import * as React from 'react';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { VersionDto } from '@bella/dto';

export interface CurrentVersionCheckboxArgs {
  currentVersion: VersionDto | undefined;
  selectedVersion: Record<'major' | 'minor', number>;
  isCurrentVersion: boolean;
  handleCurrentVersionChange: () => void;
}

const CurrentVersionCheckbox = ({
  currentVersion,
  selectedVersion,
  isCurrentVersion,
  handleCurrentVersionChange,
}: CurrentVersionCheckboxArgs) => {
  React.useEffect(() => {
    if (currentVersion && selectedVersion) {
      const isSame =
        currentVersion.major === selectedVersion.major &&
        currentVersion.minor === selectedVersion.minor;

      isSame !== isCurrentVersion && handleCurrentVersionChange();
    }
  }, [currentVersion, selectedVersion]);

  return (
    <FormControl sx={{ m: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            value={isCurrentVersion}
            checked={isCurrentVersion}
            onChange={() => handleCurrentVersionChange()}
          />
        }
        label="Główna wersja?"
      />
    </FormControl>
  );
};

export default CurrentVersionCheckbox;
