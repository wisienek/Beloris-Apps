import * as React from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { ErrorContext } from '../combined/error-box';

export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface ErrorMessageArgs {
  id: string;
  severity: ErrorSeverity;
  title?: string;
  message: string;
}

export const ErrorMessage = (args: ErrorMessageArgs) => {
  const { closeMessage } = React.useContext(ErrorContext);

  return (
    <Alert
      variant="filled"
      severity={args.severity}
      sx={{
        p: 2,
      }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => closeMessage(args.id)}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {args.title && <AlertTitle>{args.title}</AlertTitle>}
      {args.message}
    </Alert>
  );
};
