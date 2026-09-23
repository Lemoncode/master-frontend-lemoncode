import React from 'react';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

interface Props {
  children: React.ReactNode;
}

export const ThemeProviderComponent: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};
