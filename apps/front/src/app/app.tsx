import * as React from 'react';
import { Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';
import { ErrorBox, ErrorContext } from './components/combined/error-box';
import OuterLayerDrawer from './components/combined/outer-layer-drawer';
import { ApiRoutes } from './api/api-routes.enum';
import { UserContext } from './components/combined/use-user';
import { ErrorSeverity } from './components/single/error-message';
import PackageEditorPage from './pages/package-editor';

export const App = () => {
  const { addError } = React.useContext(ErrorContext);
  const { verifyUser } = React.useContext(UserContext);
  const cookies = new Cookies();

  React.useEffect(() => {
    window.api.session
      .getSession()
      .then(async (res) => {
        if (res.error) throw res.error;

        const userToken = res.data;
        cookies.set('DISCORD_TOKEN', userToken, { path: '/' });

        const { data: userData } = await axios.get(ApiRoutes.USER, {
          withCredentials: true,
        });

        verifyUser(userData);

        addError(
          ErrorSeverity.SUCCESS,
          `Zalogowano na konto: ${userData.username}`,
          true,
        );
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
        <Route path="/mods-wizard" component={PackageEditorPage} />
      </OuterLayerDrawer>
    </>
  );
};

export default App;
