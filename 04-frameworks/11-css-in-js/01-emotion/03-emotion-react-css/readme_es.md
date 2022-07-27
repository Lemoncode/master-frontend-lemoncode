# 03 Emotion React

## Resumen

Vamos a usar la librería específica de _Emotion_ para _React_

## Paso a Paso

Partimos de _00-boiler-plate_ instalamos:

```bash
npm install
```

Vamos a instalar _@emotion/react_

```bash
npm install @emotion/react
```

Con esta librería en vez de usar _className_ pasamos a usar la propiedad
_css_, que ventajas tiene esto:

- Es parecido a la propiedad _style_ pero tiene soporte para selectores
  anidados, media queries y auto [vendor prefix](https://developer.mozilla.org/es/docs/Glossary/Vendor_Prefix)

- Permite estilar componentes si usar el modo "styled component" (veremos
  esto más adelante).

- La propiedad _css_ también acepta una función que cuando se invoca se
  le pasa un _theme_ como argumento, pudiendo acceder a valores comunes.

- Es más fácil componer components y estilar.

Ahora viene una parte interesante, _css_ no existe, tenemos que hacer
un hack y es decir que en vez de usar _createElement_ para instanciar
un objeto _react_, lo cambie por uno de _emotion_.

Vamos a usar esto directamente:

_./src/app.tsx_

```diff
import React from "react";
+ import { css } from '@emotion/react';

+ const color = "red";
+
+ const h1Class = css`
+  color: ${color};
+ `;

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

Si te fijas estoda un error, no reconoce la propiedad _css_
del _h1_ esto es normal, veamos un truco para arreglar esto,
vamos a indicar a babel con _pragma_ que

```diff
+ // Esto tiene que ir arriba del todo, le indicamos a babel
+ // que en vez de usar _createElement_ use _jsx_
+ /** @jsx jsx */
import React from "react";
- import { css } from '@emotion/react';
+ import { jsx, css } from '@emotion/react';
```

La ventaja de usar esta aproximación es que nosotros decidimos donde
_createElement_ o _jsx_ pero es un desarrollo en el sea 100%
emotion esto puede ser un rollo de mantener, veamos como solucionarlo
configurando _babel_.

Vamos a instalar un preset que haga este cambio:

```bash
npm i @emotion/babel-preset-css-prop --save-dev
```

Y vamos a modificar la configuración de _babel_ para nuestro proyecto:

_.babelrc_

```diff
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react",
+    "@emotion/babel-preset-css-prop"
  ]
}
```

Si quitamos el pragma ahora:

_./src/app.tsx_

```diff
- /** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";

const color = "red";

const h1Class = css`
  color: ${color};
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

Podemos ver que funciona, pero sigue dando un error en _typescript_,
tenemos que irnos al _tsconfig_ y decirle que no emita los _js_
con _React.createElement_ y que use emotion.

_./tsconfig.json_

```diff
    "sourceMap": true,
-    "jsx": "react",
+    "jsx": "react-jsx",
+    "jsxImportSource": "@emotion/react",
    "noLib": false,
```

Ahora ya lo tenemos configurado sin pragma y con _TypeScript_.

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
