import * as React from 'react';
import {
  StyledEngineProvider,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { theme } from './theme';

export const ThemeProviderComponent = (props) => {
  const { children } = props;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
