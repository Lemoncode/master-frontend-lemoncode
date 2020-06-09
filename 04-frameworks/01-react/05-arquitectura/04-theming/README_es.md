# 04 Theming

Jugando con imagen corporativa y dando un aspecto homogeneo a la
aplicación

En este ejemplo vamos a definir un tema que va a aplicar a todos
los componentes de la aplicación.

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
import {
  Palette as DefaultPalette,
  PaletteColor,
} from '@material-ui/core/styles/createPalette';

interface Palette extends DefaultPalette {
  table: {
    row: PaletteColor;
  };
}

export interface Theme extends Omit<DefaultTheme, 'palette'> {
  palette: Palette;
}
```

- Vamos a definir el tema en sí, lo que haremos será mezclar el tema
  custom que hemos creado con el de por defecto, esta mezcla la vamos a hacer
  en profundidad, por eso el spread operator no nos vale, usaremos lodash.merge

```bash
npm install lodash.merge --save
```

_./src/core/theme/theme.ts_

```ts
import merge from 'lodash.merge';
import { createMuiTheme } from '@material-ui/core/styles';
import { Theme } from './theme.vm';

const defaultTheme = createMuiTheme();

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
```

- Ahora toca añadirlo como provider:

_./src/core/theme/theme-provider.component.tsx_

```ts
import * as React from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import StylesProvider from '@material-ui/styles/StylesProvider';
import { theme } from './theme';

export const ThemeProviderComponent = props => {
  const { children } = props;

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StylesProvider>
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

_./src/layout/centered.layout.styles.ts_

```diff
import { css } from 'emotion';
+ import { theme } from 'core/theme';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  margin-top: 2rem;
-  @media (min-width: 800px) {
+  @media (min-width: ${theme.breakpoints.values.sm}px) {
    justify-items: center;
  }
`;
```

En la aplicación de ejemplo podrás encontrar un login con
un aspecto más profesional si quieres seguir trabajandolo
puedes tomarlo como ejemplo: https://github.com/Lemoncode/origin-front-admin

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
