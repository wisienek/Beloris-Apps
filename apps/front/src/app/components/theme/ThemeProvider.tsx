import { FC, useState, createContext, useEffect, ReactElement } from 'react';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { themeCreator } from './base';

export const ThemeContext = createContext((_themeName: string): void => {});

export interface ThemeProviderWrapperArgs {
  children?: Array<ReactElement> | ReactElement;
}

const ThemeProviderWrapper: FC<ThemeProviderWrapperArgs> = ({ children }: ThemeProviderWrapperArgs) => {
  const [themeName, _setThemeName] = useState('NebulaFighterTheme');

  useEffect(() => {
    const curThemeName = window.localStorage.getItem('appTheme') || 'NebulaFighterTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <ThemeContext.Provider value={setThemeName}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            scrollbarColor: `#e6e6e6 rgb(255 255 255 / 10%)`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
              backgroundColor: 'rgb(255 255 255 / 10%)',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              backgroundColor: '#e6e6e6',
              backgroundImage: 'none',
              borderRadius: '10px',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
