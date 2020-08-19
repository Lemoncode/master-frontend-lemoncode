import merge from 'lodash.merge';
import {
  createMuiTheme,
  Theme as DefaultTheme,
} from '@material-ui/core/styles';
import { PaletteColor } from '@material-ui/core/styles/createPalette';

const defaultTheme = createMuiTheme();

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
    table: {
      row: {
        main: '#ddd',
      },
    },
  },
} as Theme);
