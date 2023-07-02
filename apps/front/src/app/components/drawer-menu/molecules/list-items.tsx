import { GuildMember } from 'discord.js';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import * as Icons from '@mui/icons-material';
import { NavbarOptions } from '@bella/enums';
import { User } from '@bella/types';
import { useTest, useNavbar } from '../hooks';

export const MainListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton component={Link} to="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Pobieralnia" />
      </ListItemButton>
    </React.Fragment>
  );
};

export interface SecondaryListItemsArgs {
  user: User;
  adminMember: GuildMember;
}

export const SecondaryListItems = ({ user, adminMember }: SecondaryListItemsArgs) => {
  const { navbarOptions } = useNavbar();
  const { sendTestAuth, testing, sendNotification } = useTest();

  const testingAssociationMap = {
    Powiadomienia: {
      onClick: sendNotification,
    },
  };

  return user ? (
    <React.Fragment>
      {navbarOptions[NavbarOptions.PUBLIC]?.length > 0 ? (
        <>
          <ListSubheader component="div" inset>
            Użytkownik
          </ListSubheader>

          {navbarOptions[NavbarOptions.PUBLIC]?.map((item, i) => (
            <ListItemButton key={`${NavbarOptions.PUBLIC}-${i}`}>
              <ListItemIcon>{React.createElement(Icons[item.icon])}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </>
      ) : (
        <></>
      )}

      {adminMember ? (
        <>
          {navbarOptions[NavbarOptions.ADMIN]?.length > 0 ? (
            <>
              <ListSubheader component="div" inset>
                Admin
              </ListSubheader>

              {navbarOptions[NavbarOptions.ADMIN]?.map((item, i) => (
                <ListItemButton
                  key={`${NavbarOptions.ADMIN}-${i}`}
                  {...(item?.to
                    ? {
                        component: Link,
                        to: item.to,
                      }
                    : {})}
                >
                  <ListItemIcon>{React.createElement(Icons[item.icon])}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </>
          ) : (
            <></>
          )}

          {navbarOptions[NavbarOptions.TESTING]?.length > 0 ? (
            <>
              <ListSubheader component="div" inset>
                Testowe
              </ListSubheader>

              {navbarOptions[NavbarOptions.TESTING]?.map((item, i) => (
                <ListItemButton
                  key={`${NavbarOptions.TESTING}-${i}`}
                  {...(testingAssociationMap[item.name] ?? {})}
                  {...(item?.to
                    ? {
                        component: Link,
                        to: item.to,
                      }
                    : {})}
                >
                  <ListItemIcon>{React.createElement(Icons[item.icon])}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </React.Fragment>
  ) : (
    <></>
  );
};
