import { Theme as DefaultTheme } from '@material-ui/core/styles';
import { Palette as DefaultPalette } from '@material-ui/core/styles/createPalette';

interface Gradients {
  g1: (angle?: string) => string;
  g2: string;
}

interface Palette extends DefaultPalette {
  custom: {
    grey: {
      background: string;
    };
    icons: {
      black: string;
      grey1: string;
      grey2: string;
      secondary: string;
    };
    text: {
      background: {
        primary: string;
        secondary: string;
      };
      selected: string;
    };
    footer: string;
  };
  gradients: Gradients;
}

export interface Theme extends Omit<DefaultTheme, 'palette'> {
  palette: Palette;
}
