import merge from 'lodash.merge';
import { createMuiTheme } from '@material-ui/core/styles';
import { Theme } from './theme.vm';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#D7001B',
    },
    secondary: {
      main: '#334C78',
      light: '#FF4E61',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#3C3C3C',
      hint: '#9D9D9D',
    },
    error: {
      main: '#FF4E61',
    },
    success: {
      main: '#009856',
    },
  },
  typography: {
    allVariants: {
      fontFamily: 'Roboto',
      color: '#1E1E1E',
    },
    h1: {
      fontFamily: 'Montserrat',
    },
    h2: {
      fontFamily: 'Montserrat',
    },
    h3: {
      fontFamily: 'Montserrat',
    },
    h4: {
      fontFamily: 'Montserrat',
    },
    h5: {
      fontFamily: 'Montserrat',
    },
    h6: {
      fontFamily: 'Montserrat',
    },
    subtitle1: {
      fontFamily: 'Lato',
      fontWeight: 300,
      letterSpacing: 0,
      lineHeight: 1,
      fontSize: '1.2rem',
    },
    subtitle2: {
      fontFamily: 'Lato',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    body1: {
      fontFamily: 'Lato',
      fontWeight: 300,
      letterSpacing: 0,
      lineHeight: 1,
    },
    body2: {
      fontFamily: 'Roboto',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'Roboto',
      fontWeight: 400,
      textTransform: 'none',
    },
    overline: {
      fontFamily: 'Lato',
      fontWeight: 300,
    },
  },
  overrides: {
    MuiLink: {
      root: {
        cursor: 'pointer',
      },
    },
    MuiAppBar: {
      root: {
        backgroundColor: '#FFFFFF',
      },
      colorPrimary: {
        backgroundColor: '#FFFFFF',
      },
    },
  },
});

export const theme: Theme = merge(defaultTheme, {
  palette: {
    custom: {
      grey: {
        background: '#F5F5F5',
      },
      icons: {
        black: '#040506',
        grey1: '#9D9D9D',
        grey2: '#3C3C3C',
        secondary: '#ffffff80',
      },
      text: {
        background: {
          primary: '#C7005A',
          secondary: '#60478A',
        },
        selected: '#334C78',
      },
      footer: '#475D85',
    },
    gradients: {
      g1: (angle = '170deg') =>
        `linear-gradient(${angle}, #d7001b, #d50036, #ce004d, #c20061, #b21971, #a22a7c, #903584, #7d3e89, #67458a, #534987, #414b81, #334c78);`,
      g2: 'linear-gradient(90deg, #FFFFFF 50%, #808080 100%)',
    },
  },
  breakpoints: {
    values: {
      xs: 320,
    },
  },
} as Theme);
