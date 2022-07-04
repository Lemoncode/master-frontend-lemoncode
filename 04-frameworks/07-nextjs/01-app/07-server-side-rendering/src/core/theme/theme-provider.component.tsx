import React from 'react';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  CssBaseline,
} from '@mui/material';
import { theme } from './theme';

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={cache}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  );
};
