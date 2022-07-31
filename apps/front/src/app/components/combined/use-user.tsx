import * as React from 'react';
import { ErrorContext, ErrorContextValue } from './error-box';

export interface UserContextValue {
  user: any;
  loadingUser: boolean;
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  loadingUser: false,
});

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [loadingUser, setLoadingUser] = React.useState<boolean>(false);
  const [user, setUser] = React.useState(null);
  const { addError } = React.useContext<ErrorContextValue>(ErrorContext);

  // React.useEffect(() => {
  //   fetch(ApiRoutes.LOGIN, { method: 'GET', redirect: 'follow' }).catch(
  //     (err) => {
  //       console.log(`logging err`, err);
  //       addError({
  //         id: '',
  //         message: err.message as string,
  //         severity: ErrorSeverity.ERROR,
  //       });
  //     },
  //   );
  // }, []);

  return (
    <UserContext.Provider value={{ user, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
