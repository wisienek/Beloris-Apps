import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Typography, Box, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  color: theme.palette.mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.dark,
}));

export class LinearProgressWithLabelProps {
  progressBarProps?: LinearProgressProps;
  labelProps?: TypographyProps;
  value: number;
  label?: string;
}

const LinearProgressWithLabel = ({ progressBarProps, value, label, labelProps }: LinearProgressWithLabelProps) => {
  return (
    <>
      {label ? (
        <Typography
          variant="body2"
          {...labelProps}
          sx={{
            ...(labelProps?.sx ?? {}),
            fontWeight: 'bold',
          }}
        >
          {label}
        </Typography>
      ) : (
        <></>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <CustomLinearProgress variant="determinate" {...progressBarProps} value={value} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" {...labelProps}>{`${Math.round(value)}%`}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default LinearProgressWithLabel;
