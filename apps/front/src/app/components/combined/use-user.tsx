import * as React from 'react';
import * as _ from 'lodash';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { ApiRoutes } from '../../api/api-routes.enum';
import { User } from '@bella/types';

export interface UserContextValue {
  user: User;
  verifyUser: (user: User) => void;
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  verifyUser: (user: User) => null,
});

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const cookies = new Cookies();

  const [user, setUser] = React.useState<User>(null);

  const verifyUser = (data: User) => {
    if (!user || !_.isEqual(user, data)) setUser({ ...data });
  };

  React.useEffect(() => {
    window.api.utilities
      .getSession()
      .then(async (res) => {
        if (res.failed && res.error) throw res.error;

        const userToken = res.data;
        cookies.set('DISCORD_TOKEN', userToken, { path: '/' });

        const { data: userData } = await axios.get(ApiRoutes.ME, {
          withCredentials: true,
        });

        verifyUser(userData);
      })
      .catch((error) =>
        console.error(`Error przy fetchowaniu usera (local)`, error),
      );
  }, []);

  return (
    <UserContext.Provider value={{ user, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
};
