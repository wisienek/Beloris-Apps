import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ImportExportRoundedIcon from '@mui/icons-material/ImportExportRounded';

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

export const SecondaryListItems = (user, adminMember) => {
  return user ? (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Użytkownik
      </ListSubheader>

      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Skiny" />
      </ListItemButton>

      {adminMember && (
        <>
          <ListItemButton component={Link} to="/mods-wizard">
            <ListItemIcon>
              <ImportExportRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Edytowanie paczki" />
          </ListItemButton>
        </>
      )}
    </React.Fragment>
  ) : (
    <></>
  );
};
