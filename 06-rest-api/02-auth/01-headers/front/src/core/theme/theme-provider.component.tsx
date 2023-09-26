import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
