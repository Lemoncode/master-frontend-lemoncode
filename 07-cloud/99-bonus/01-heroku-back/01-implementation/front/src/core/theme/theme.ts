import { createMuiTheme, Theme } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#006A7B'
    }
  }
});

export const theme: Theme = defaultTheme;
