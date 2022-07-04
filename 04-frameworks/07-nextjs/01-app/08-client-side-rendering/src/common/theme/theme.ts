import { createMuiTheme, Theme } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#008C86',
    },
  },
});

export const theme: Theme = defaultTheme;
