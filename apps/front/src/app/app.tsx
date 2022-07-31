import * as React from 'react';
import OuterLayerDrawer from './components/combined/outer-layer-drawer';
import { Route } from 'react-router-dom';
import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';
import { ErrorBox } from './components/combined/error-box';

export const App = () => {
  // const location = useLocation();

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
