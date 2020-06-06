# 04 Theming

Jugando con imagen corporativa y dando un aspecto homogeneo a la
aplicación

# Pasos

- Copiate el ejemplo anterior _03-login-form-functionallity y haz un \_npm install_

```bash
npm install
```

- Ahora nos toca la parte de martillo fino, en este caso vamos a tocar colores
  y ciertos aspectos globales de estilado, Material UI nos permite crear temas
  personalizados.

- Vamos primero a crear un Tema con los colores que necesitemos y también
  a añadir algunas propiedades propias a nuestro tema:

_./src/core/theme/theme.vm.ts_

```ts
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
```

- Vamos a definir el tema en sí, lo que haremos será mezclar el tema
custom que hemos creado con el de por defecto, esta mezcla la vamos a hacer
en profundidad, por eso el spread operator no nos vale, usaremos lodash.merge

_./src/core/theme/theme.ts_

```ts
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
```
- Ahora toca añadirlo como provider:

_./src/core/theme/provider.ts_

```ts
import * as React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './theme';

export const ThemeProviderComponent = props => {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
```

_./src/core/theme/index.ts_

```ts
export * from './theme-provider.component';
export * from './theme';
```


- Exponerlo en la aplicación:

_./src/app.tsx_

```diff
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
+ import { ThemeProviderComponent } from 'core/theme';

const App: React.FunctionComponent = () => {
-  return <RouterComponent />;
+  return (
+     <ThemeProviderComponent>
+        <RouterComponent />
+     </ThemeProviderComponent>
+  )
};

export default hot(App);
```

- Exponerlo en la aplicación:

- Si arrancamos veremos que los colores generales de la aplicación han cambiado:

- Vamos a aprovechar y quitar el harcodeo del break point sm enla query de
layout centerd y convertirlo a usar propiedades del theme:

```
```

Bueno esto funciona, pero ahora nos toca la parte de martillo fino... nos piden que el login tenga un aspecto más personalizado, desde el departamento de diseño nos proponen el siguiente diseño:

**Pantallazo**

Aquí tenemos dos concerns separados:

- Por un lado el aspecto del formulario (hay que añadir un icono, jugar con margenes...).
- Por otro el uso de colores en general (esto lo trataremos en el siguente
  ejemplo).

- Manos a la obra.

- Si evaluamos

**_ SEGUIR AQUI CANDADO ESTILOS ETC_**

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
