# 06 Media queries

## Resumen

Un tema interesante que nos ofrece _css in js_ es el manejo de
media queries.

## Paso a Paso

Partimos de _05-composition_ instalamos:

```bash
npm install
```

Vamos a dejar el código de siempre:

_./app.tsx_

```tsx
import React from "react";

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

Vamos a indicarle que si el tamaño es normal vamos a mostrar
el _h1_ con un tamaño de fuento del 120% y si estamos por debajo
de una resolución lo vamos a poner al 80%

```diff
import React from "react";
+ import { css } from '@emotion/react';

+ const breakpointSm = 420;
+
+ const h1Class = css`
+  font-size: 180%;
+  @media (max-width: ${breakpointSm}px) {
+   font-size: 80%;
+ }
+ `


export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

También nos podemos plantear usar un enumerado y una array para almacenar los diferentes puntos
de corte, podríamos incluso crear un hook para esto y permitir hacer cambios en caliente.

```diff
+ enum bp {
+  xs,
+  sm,
+  md,
+  lg
+ }

+ const bpValues : number[] = [];
+
+ bpValues[bp.xs] = 767;
+ bpValues[bp.sm] = 991;
+ bpValues[bp.md] = 1199;
+ bpValues[bp.lg] = 1200;
+
+ const mq: string[] = bpValues.map((bp) => `@media(min-width: ${bp}px)`);
+
- const breakpointSm = 420;

 const h1Class = css`
  font-size: 180%;
-  @media (max-width: ${breakpointSm}px) {
-    font-size: 80%;
-  }
+  ${mq[bp.lg]} {
+    font-size: 100%;
+  }
+  ${mq[bp.md]} {
+    font-size: 100%;
+  }
+  ${mq[bp.sm]} {
+    font-size: 80%;
+  }
+  ${mq[bp.xs]} {
+    font-size: 60%;
+  }
`;
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
