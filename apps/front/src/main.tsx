import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './app/app';
import { ErrorBoxContext } from './app/components/combined/error-box';
import { UserProvider } from './app/components/combined/use-user';
import ThemeProvider from './app/components/theme/ThemeProvider';
import SettingsContextProvider from './app/settings/settings';

ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <ErrorBoxContext>
          <SettingsContextProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </SettingsContextProvider>
        </ErrorBoxContext>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
  document.getElementById('root'),
);
