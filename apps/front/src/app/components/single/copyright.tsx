import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import * as React from 'react';
import { useTheme } from '@mui/material';

export const Copyright = (props: any) => {
  const theme = useTheme();
  return (
    <Typography
      variant="body2"
      align="center"
      color={theme.colors.secondary.dark}
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/wisienek">
        Wisienek
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
};
