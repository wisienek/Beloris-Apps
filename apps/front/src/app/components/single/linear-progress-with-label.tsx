import * as React from 'react';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ProgressTypography = styled(Typography)(
  ({ theme }) => `
      color: ${theme.palette.primary.contrastText};
      font-weight: bold;
`,
);

export const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  backgroundColor:
    theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  color:
    theme.palette.mode === 'light'
      ? theme.palette.secondary.light
      : theme.palette.secondary.dark,
}));

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <>
      <ProgressTypography variant="body2">
        Pobieram: {`nazwa pobieranego elementu...`}
      </ProgressTypography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <CustomLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <ProgressTypography variant="body2">{`${Math.round(
            props.value,
          )}%`}</ProgressTypography>
        </Box>
      </Box>
    </>
  );
}

export default LinearProgressWithLabel;
