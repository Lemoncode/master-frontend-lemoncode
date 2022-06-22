import merge from 'lodash.merge';
import {
  createTheme,
  Theme as DefaultTheme,
  PaletteColor,
} from '@mui/material';

const defaultTheme = createTheme({
  palette: {
    primary: {
      light: '#4a8089',
      main: '#1a535c',
      dark: '#002a33',
    },
    secondary: {
      light: '#fff584',
      main: '#d6c254',
      dark: '#a29223',
    },
    success: {
      main: '#43a047',
    },
    info: {
      main: '#1976d2',
    },
    warning: {
      main: '#ffa000',
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-selected': {
            color: '#ffffff',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

type Theme = DefaultTheme & {
  palette: {
    primary: PaletteColor;
    secondary: PaletteColor;
    success: PaletteColor;
    info: PaletteColor;
    warning: PaletteColor;
    table: {
      row: PaletteColor;
    };
  };
};

export const theme: Theme = merge(defaultTheme, {
  palette: {
    table: {
      row: {
        main: '#ddd',
      },
    },
  },
} as Theme);
