import { createTheme, Theme } from '@mui/material';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#006A7B',
    },
  },
});

export const theme: Theme = defaultTheme;
