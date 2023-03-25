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
          styles={
            {
              // FIXME: Change scrollbar.
              // scrollbarColor: `#2b2b2b #6b6b6b`,
              // '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              //   backgroundColor: '#6b6b6b',
              // },
              // '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              //   borderRadius: 12,
              //   backgroundColor: '#2b2b2b',
              //   minHeight: 24,
              //   width: 6,
              //   border: `2px solid #6b6b6b`,
              // },
              // '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              //   backgroundColor: '#959595',
              // },
              // '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              //   backgroundColor: '#959595',
              // },
              // '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              //   backgroundColor: '#959595',
              // },
              // '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              //   backgroundColor: '#6b6b6b',
              // },
            }
          }
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
