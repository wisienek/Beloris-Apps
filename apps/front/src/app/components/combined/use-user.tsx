import * as React from 'react';
import * as _ from 'lodash';
import axios from 'axios';

import { ApiRoutes } from '../../api/api-routes.enum';
import { User } from '@bella/types';
import { GuildMember, Role } from 'discord.js';

export interface UserContextValue {
  user: User;
  verifyUser: (user: User) => void;
  belorisMember: GuildMember;
  belorisAdminMember: GuildMember;
  belorisMemberRoles: Role[];
  belorisAdminRoles: Role[];
}

export const UserContext = React.createContext<UserContextValue>({
  user: null,
  verifyUser: (user: User) => null,
  belorisMember: null,
  belorisAdminMember: null,
  belorisMemberRoles: null,
  belorisAdminRoles: null,
});

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = React.useState<User>(null);

  const [belorisMember, setBelorisMember] = React.useState<GuildMember>(null);
  const [belorisAdminMember, setBelorisAdminMember] =
    React.useState<GuildMember>(null);

  const [belorisMemberRoles, setBelorisMemberRoles] =
    React.useState<Role[]>(null);
  const [belorisAdminMemberRoles, setBelorisAdminMemberRoles] =
    React.useState<Role[]>(null);

  const verifyUser = (data: User) => {
    if (!user || !_.isEqual(user, data)) setUser({ ...data });
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

            console.log(`AdminRoles: `, adminRoles);
            if (adminRoles) setBelorisMemberRoles(adminRoles);
          }

          if (fetchedBelorisMember) {
            setBelorisMember(fetchedBelorisMember);

            const { data: mainRoles } = await axios.get(
              ApiRoutes.MEMBER_Main_ROLES,
              { withCredentials: true },
            );

            console.log(`MainRoles: `, mainRoles);
            if (mainRoles) setBelorisMemberRoles(mainRoles);
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
        belorisMember,
        belorisAdminMember,
        belorisMemberRoles,
        belorisAdminRoles: belorisAdminMemberRoles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
