import { createTheme, Theme } from '@material-ui/core/styles';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#008C86',
    },
  },
});

export const theme: Theme = defaultTheme;
