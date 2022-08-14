import * as React from 'react';
import { Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';
import { ErrorBox } from './components/combined/error-box';
import OuterLayerDrawer from './components/combined/outer-layer-drawer';
import { ApiRoutes } from './api/api-routes.enum';
import { UserContext } from './components/combined/use-user';

export const App = () => {
  const { verifyUser } = React.useContext(UserContext);
  const cookies = new Cookies();

  React.useEffect(() => {
    window.api.utilities
      .getSession()
      .then(async (res) => {
        if (res.failed && res.error) throw res.error;

        const userToken = res.data;
        cookies.set('DISCORD_TOKEN', userToken, { path: '/' });

        const { data: userData } = await axios.get(ApiRoutes.USER, {
          withCredentials: true,
        });

        verifyUser(userData);
      })
      .catch((error) =>
        console.error(`Error przy fetchowaniu usera (local)`, error),
      );
  }, []);

  return (
    <>
      <ErrorBox />
      <OuterLayerDrawer>
        <Route path="/" exact component={MainPage} />
        <Route path="/settings" component={SettingsPage} />
      </OuterLayerDrawer>
    </>
  );
};

export default App;
