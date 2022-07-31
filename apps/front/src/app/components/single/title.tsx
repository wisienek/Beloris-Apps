import * as React from 'react';
import Typography from '@mui/material/Typography';

interface TitleProps {
  id?: string;
  children?: React.ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography
      id={props.id}
      component="h2"
      variant="h6"
      color="primary"
      gutterBottom
    >
      {props.children}
    </Typography>
  );
}
