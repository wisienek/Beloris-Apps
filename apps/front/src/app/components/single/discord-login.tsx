import * as React from 'react';
import { Discord } from 'mdi-material-ui';
import { Fab, FormControl, Grid, Typography } from '@mui/material';
import axios from 'axios';

import { ApiRoutes } from '../../api/api-routes.enum';

const DiscordLogin = () => {
  const loginLink = async () => {
    const { data: loginUrl } = await axios.get(ApiRoutes.LOGIN);

    console.log(`Login will be on:`, loginUrl);

    window.api.utilities.receiveSession((cookie) => {
      console.log(`Got cookie!`, cookie);
    });

    await window.api.utilities.openExternalLink(loginUrl);
  };

  return (
    <>
      <Grid item sx={{ position: 'relative' }}>
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
      </Grid>
    </>
  );
};

export default DiscordLogin;
