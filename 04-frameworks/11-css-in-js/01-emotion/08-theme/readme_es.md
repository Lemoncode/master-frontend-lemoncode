# 08 Creando temas

## Resumen

Una funcionalidad muy interesante es la de poder crear _themes_ de forma
que tocando en un sólo sitio podamos definir los colores de nuestra forma

## Paso a Paso

Partimos de _07-global-styles_ instalamos:

```bash
npm install
```

Vamos a partir de un app simple:

_./src/app.tsx_

```tsx
import React from "react";
import { jsx, css } from "@emotion/react";

export const App = () => {
  return <div></div>;
};
```

Vamos a definir un tema:

_./src/app.tsx_

```diff
import React from "react";
- import { jsx, css } from "@emotion/react";
+ import { jsx, css, ThemeProvider, useTheme } from "@emotion/react";

+ const theme  : Theme = {
+  colors: {
+    primary: 'green'
+  }
+ }
```

Vamos a definirlo en el root de nuestra aplicación:

_./src/app.tsx_

```diff
export const App = () => {
  return (
+    <ThemeProvider theme={theme}>
      <div>
      </div>
+    </ThemeProvider>
  );
};
```

Y ahora vamos a definir un componente hijo:

_./src/mycomponent.tsx_

```tsx
import React from "react";
import { jsx, css, useTheme } from "@emotion/react";

const h1Class = (theme) => css`
  color: ${theme.colors.primary};
`;

export const MyComponent = () => {
  const theme = useTheme();

  return <h1 css={h1Class(theme)}>Hello React !!</h1>;
};
```

Vamos a consumir este componente desde app:

_./src/app.tsx_

```diff
import React from "react";
import { jsx, css, ThemeProvider, useTheme } from "@emotion/react";
+ import { MyComponent } from "./mycomponent";

interface MyTheme {
  colors: { primary: string };
}

const theme = {
  colors: {
    primary: "green",
  },
};

const globalStyles = css`
  .base-background {
    background-color: gray;
  }
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
+      <MyComponent />
      </div>
    </ThemeProvider>
  );
};
```

Si usamos sintaxis de objeto el manejo de temas se queda más simple ya que lo acepta
como propiedad directamente:

```typescript
import React from "react";
import { jsx, css, useTheme } from "@emotion/react";

const h1Class = (theme) => css`
  color: ${theme.colors.primary};
`;

export const MyComponent = () => {
  const theme = useTheme();

  return <h1 css={h1Class(theme)}>Hello React !!</h1>;
};
```

También podríamos haver incluido directamente la asignación en el CSS:

```diff
import React from 'react';
import { jsx, css, useTheme } from "@emotion/react";

- const h1Class = (theme) => css`
-  color: ${theme.colors.primary};
- `;

export const MyComponent = () => {
  const theme : any = useTheme(); // TODO podemos tipar esto

  return (
-    <h1 css={h1Class(theme)}>Hello React !!</h1>
+    <h1 css={css`
        color: ${theme.colors.primary}
      `
      }>Hello React !!</h1>

  )
}
```

Y una tercera opción es usar la sintaxis de objeto:

```diff
export const MyComponent = () => {
-  const theme : any = useTheme(); // TODO podemos tipar esto

  return (
-    <h1 css={css`
-        color: ${theme.colors.primary}
-      `

+    <h1
+      css={theme => (`
+        color: theme.colors.primary
+      `)}
    >
      Hello React !!
    </h1>
  );
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)

Y si lo que necesitas es ponerete al día en Backend, con nuestro Bootcamp
podrás parender stack node + documental y .net + relacional [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
