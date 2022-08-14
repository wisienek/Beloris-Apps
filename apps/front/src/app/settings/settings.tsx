import React from 'react';

import {
  ErrorContext,
  ErrorContextValue,
} from '../components/combined/error-box';
import { ErrorSeverity } from '../components/single/error-message';

import { UserSettings } from '@bella/schema';

const readUserSavedSettings = async () => {
  return await window?.api?.settings?.getUserSettings();
};

const setUserSavedSettings = async (settings: Partial<UserSettings>) => {
  return await window.api.settings.saveUserSettings(settings);
};

export interface SettingsContextValue {
  settings: UserSettings;
  saveSettings: (data: Partial<UserSettings>) => Promise<void>;
}

export const SettingsContext = React.createContext<SettingsContextValue>({
  settings: null,
  saveSettings: (data: Partial<UserSettings>) => null,
});

const SettingsContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [settings, setSettings] = React.useState<UserSettings>(null);
  const { addError } = React.useContext<ErrorContextValue>(ErrorContext);

  const saveSettings = async (data: Partial<UserSettings>) => {
    const saved = await setUserSavedSettings({ ...settings, ...data });

    if (saved?.failed)
      addError(
        ErrorSeverity.ERROR,
        saved?.error?.message ??
          `Coś poszło nie tak przy zapisywaniu ustawień użytkownika!`,
      );
    else setSettings({ ...settings, ...data });
  };

  React.useEffect(() => {
    readUserSavedSettings()
      .then((response) => {
        if (response.failed) throw response.error;

        setSettings(response.data);
      })
      .catch((error) => {
        if (error)
          addError(
            ErrorSeverity.ERROR,
            'Coś poszło nie tak ze wczytywaniem ustawień!',
            false,
          );
      });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
