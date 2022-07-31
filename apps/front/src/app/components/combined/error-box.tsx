import { Stack } from '@mui/material';
import * as React from 'react';
import {
  ErrorMessage,
  ErrorMessageArgs,
  ErrorSeverity,
} from '../single/error-message';
import { v4 } from 'uuid';

export const ErrorBox = () => {
  const { errors } = React.useContext<ErrorContextValue>(ErrorContext);

  return (
    <Stack
      justifyContent="flex-end"
      alignItems="stretch"
      spacing={0.5}
      sx={{
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        zIndex: '1000',
        width: '40vw',
        height: '30vh',
      }}
    >
      {errors.map((message) => (
        <ErrorMessage {...message} key={message.id} />
      ))}
    </Stack>
  );
};

export interface ErrorContextValue {
  addError: (
    severity: ErrorSeverity,
    message: string,
    autoClose?: boolean,
    id?: string,
    title?: string,
  ) => void;
  closeMessage: (id: string) => void;
  errors: ErrorMessageArgs[];
}

export const ErrorContext = React.createContext<ErrorContextValue>({
  addError(
    severity: ErrorSeverity,
    message: string,
    autoClose?: boolean,
    id?: string,
    title?: string,
  ): void {},
  errors: [],
  closeMessage(id: string): void {},
});

export const ErrorBoxContext = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [errors, setErrors] = React.useState<ErrorMessageArgs[]>([]);

  const addError = (
    severity: ErrorSeverity,
    message: string,
    autoClose: boolean = true,
    id: string = v4(),
    title?: string,
  ) => {
    const nErr: ErrorMessageArgs = {
      severity,
      message,
      id,
      title,
    };

    setErrors([...errors, nErr]);

    autoClose &&
      setTimeout(() => {
        closeMessage(nErr.id);
      }, 5 * 1000);
  };

  const closeMessage = (id: string) => {
    setErrors(errors.filter((e) => e.id !== id));
  };

  return (
    <ErrorContext.Provider value={{ addError, errors, closeMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
