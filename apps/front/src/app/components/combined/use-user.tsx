import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';
import { GuildMember, Role } from 'discord.js';

import { User } from '@bella/types';

import { ApiRoutes } from '../../api/api-routes.enum';
import Cookies from 'universal-cookie';
import { CookiesEnum } from '@bella/enums';
import { ErrorContext } from './error-box';
import { ErrorSeverity } from '../single/error-message';

export interface UserContextValue {
  user: User;
  verifyUser: (user: User) => void;
  logout: () => void;
  belorisMember: GuildMember;
  belorisAdminMember: GuildMember;
  belorisMemberRoles: Role[];
  belorisAdminRoles: Role[];
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  verifyUser: (user: User) => null,
  logout: () => null,
  belorisMember: null,
  belorisAdminMember: null,
  belorisMemberRoles: null,
  belorisAdminRoles: null,
});

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const { addError } = React.useContext(ErrorContext);
  const [user, setUser] = React.useState<User>(null);

  const [belorisMember, setBelorisMember] = React.useState<GuildMember>(null);
  const [belorisAdminMember, setBelorisAdminMember] =
    React.useState<GuildMember>(null);

  const [belorisMemberRoles, setBelorisMemberRoles] =
    React.useState<Role[]>(null);
  const [belorisAdminRoles, setBelorisAdminRoles] =
    React.useState<Role[]>(null);

  const verifyUser = (data: User) => {
    if (!user || !_.isEqual(user, data)) setUser({ ...data });
  };

  const logout = async () => {
    const message = `Wylogowano z konta ${user.username}`;

    await window.api.utilities.logout();
    const cookies = new Cookies();
    cookies.remove(CookiesEnum.DISCORD_TOKEN);

    setUser(null);
    setBelorisMember(null);
    setBelorisAdminMember(null);
    setBelorisMemberRoles(null);
    setBelorisAdminRoles(null);

    addError(ErrorSeverity.INFO, message, true);
  };

  React.useEffect(() => {
    (async () => {
      try {
        if (user) {
          console.log(`Trying to fetch members`);

          const { data: fetchedBelorisMember } = await axios.get(
            ApiRoutes.MEMBER_Main,
            { withCredentials: true },
          );
          const { data: fetchedBelorisAdminMember } = await axios.get(
            ApiRoutes.MEMBER_ADMIN,
            { withCredentials: true },
          );

          if (fetchedBelorisAdminMember) {
            setBelorisAdminMember(fetchedBelorisAdminMember);

            const { data: adminRoles } = await axios.get(
              ApiRoutes.MEMBER_ADMIN_ROLES,
              { withCredentials: true },
            );

            if (adminRoles) setBelorisAdminRoles(adminRoles);

            addError(
              ErrorSeverity.INFO,
              `Załadowano dane z serwera adminów`,
              true,
            );
          }

          if (fetchedBelorisMember) {
            setBelorisMember(fetchedBelorisMember);

            const { data: mainRoles } = await axios.get(
              ApiRoutes.MEMBER_Main_ROLES,
              { withCredentials: true },
            );

            if (mainRoles) setBelorisMemberRoles(mainRoles);

            addError(
              ErrorSeverity.INFO,
              `Załadowano dane z serwera DC Beloris`,
              true,
            );
          }
        }
      } catch (error) {
        console.error(`Error while fetching members`, error);
      }
    })();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        verifyUser,
        logout,
        belorisMember,
        belorisAdminMember,
        belorisMemberRoles,
        belorisAdminRoles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
