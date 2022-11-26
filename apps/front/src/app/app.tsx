import { useEffect } from 'react';
import { Route } from 'react-router-dom';

import MainPage from './pages/main-page';
import SettingsPage from './pages/settings-page';
import { ErrorBox } from './components/combined/error-box';
import OuterLayerDrawer from './components/combined/outer-layer-drawer';
import PackageEditorPage from './pages/package-editor';
import PackageEditorStateContextProvider from './components/package-editor/sections/package-editor-state';
import { useLogin } from './hooks';

export const App = () => {
  const { login } = useLogin();

  useEffect(() => {
    login();
  }, []);

  return (
    <>
      <ErrorBox />
      <OuterLayerDrawer>
        <Route path="/" exact component={MainPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/mods-wizard">
          <PackageEditorStateContextProvider>
            <PackageEditorPage />
          </PackageEditorStateContextProvider>
        </Route>
      </OuterLayerDrawer>
    </>
  );
};

export default App;
