import { Route } from 'react-router-dom';
import { useEffect } from 'react';
import PackageEditorStateContextProvider from './components/package-editor/sections/package-editor.state';
import OuterLayerDrawer from './components/drawer-menu/sections/outer-layer-drawer';
import { ErrorBox } from './components/combined/error-box';
import PackageEditorPage from './pages/package-editor';
import SettingsPage from './pages/settings-page';
import MainPage from './pages/main-page';
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
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/mods-wizard" exact>
          <PackageEditorStateContextProvider>
            <PackageEditorPage />
          </PackageEditorStateContextProvider>
        </Route>
      </OuterLayerDrawer>
    </>
  );
};

export default App;
