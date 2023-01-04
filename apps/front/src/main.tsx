import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './app/app';
import { ErrorBoxContext } from './app/components/combined/error-box';
import { UserProvider } from './app/components/context/user-context';
import ThemeProvider from './app/components/theme/ThemeProvider';
import SettingsContextProvider from './app/settings/settings';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: `https://be79019d3be54446a3a393a0d62604fa@o1425024.ingest.sentry.io/6773291`,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

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
