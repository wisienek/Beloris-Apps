import { FileUploadDto, UploadPackageInfo } from '@bella/dto';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RemoveIcon from '@mui/icons-material/Remove';

export interface WizardFileControlsArgs<
  T extends FileUploadDto | UploadPackageInfo,
> {
  isPackageFile: T extends UploadPackageInfo ? true : false;
  file: T;

  deleteSelection: (name: string) => void;
  checkOptional?: (name: string) => void;
}

const WizardFileControls = (args: WizardFileControlsArgs<any>) => {
  const theme = useTheme();

  return (
    <Box>
      {!args.isPackageFile ? (
        <Tooltip arrow title="Zaznacz jako opcjonalne" placement="top">
          <IconButton
            size="small"
            color="secondary"
            sx={{
              ml: 0.5,
            }}
          >
            <CheckBoxOutlineBlankIcon />
          </IconButton>
        </Tooltip>
      ) : null}

      <Tooltip arrow title="Usuń plik z wybranych" placement="top">
        <IconButton
          size="small"
          sx={{
            color: `${theme.colors.warning.main}`,
            ml: 0.5,
          }}
        >
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default WizardFileControls;
