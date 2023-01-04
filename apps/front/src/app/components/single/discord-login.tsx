import * as React from 'react';
import { Discord } from 'mdi-material-ui';
import { Fab, FormControl, Grid, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { ApiRoutes } from '@bella/data';

import { UserContext, UserContextValue } from '../context/user-context';
import DiscordIdentity from '../combined/discord-identity';

const DiscordLogin = () => {
  const cookies = new Cookies();

  const { user, verifyUser } = React.useContext<UserContextValue>(UserContext);

  const loginLink = async () => {
    const { data: loginUrl } = await axios.get(ApiRoutes.LOGIN);

    console.log(`Login will be on:`, loginUrl);

    window.api.session.receiveSession(async (cookie) => {
      console.log(`Got cookie!`, Object.keys(cookie).length);

      cookies.set('DISCORD_TOKEN', cookie, { path: '/' });

      const { data: userData } = await axios.get(ApiRoutes.USER, {
        withCredentials: true,
      });

      verifyUser(userData);
    });

    await window.api.utilities.openExternalLink(loginUrl);
  };

  return (
    <>
      <Grid item sx={{ position: 'relative' }}>
        <Typography variant="subtitle1">Tożsamość Discordowa</Typography>

        {user ? (
          <DiscordIdentity />
        ) : (
          <FormControl variant="outlined" fullWidth>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Zaloguj przez Discord"
              onClick={() => loginLink()}
            >
              <Discord sx={{ mr: 3 }} />
              <Typography variant="subtitle1">Zaloguj przez Discord</Typography>
            </Fab>
          </FormControl>
        )}
      </Grid>
    </>
  );
};

export default DiscordLogin;
