import { tooltipClasses, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Tooltip as MTooltip } from '@mui/material';

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => {
  const isDarkTheme = theme.palette.mode === 'dark';

  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: isDarkTheme
        ? theme.palette.common.white
        : theme.palette.common.black,
      color: isDarkTheme ? 'rgba(0, 0, 0, 0.87)' : 'white',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: isDarkTheme
        ? theme.palette.common.white
        : theme.palette.common.black,
    },
  };
});

export default Tooltip;
