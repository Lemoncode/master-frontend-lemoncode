import { createTheme, Theme } from '@mui/material';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#008C86',
    },
  },
});

export const theme: Theme = defaultTheme;
