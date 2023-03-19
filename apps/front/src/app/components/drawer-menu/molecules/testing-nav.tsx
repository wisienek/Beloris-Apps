import { Fragment } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { GuildMember } from 'discord.js';
import { useTest } from '../hooks';

export interface TestingNavArgs {
  member: GuildMember;
}

const TestingNav = (data: TestingNavArgs) => {
  const { sendTestAuth, testing, sendNotification } = useTest();

  return (
    <Fragment>
      <ListSubheader component="div" inset>
        Testy
      </ListSubheader>

      <ListItemButton onClick={() => sendNotification()}>
        <ListItemIcon>
          <ConstructionIcon />
        </ListItemIcon>
        <ListItemText primary={testing ? `Testuję...` : `Testuj role`} />
      </ListItemButton>
    </Fragment>
  );
};

export default TestingNav;
