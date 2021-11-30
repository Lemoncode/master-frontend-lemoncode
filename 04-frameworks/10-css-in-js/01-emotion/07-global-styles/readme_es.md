# 07 Estilos globales

## Resumen

Es muy común que quieras tener estilos global en tu aplicación, para hacer cosas tales como:

- Poder hacer un reset css de cada navegador

## Paso a Paso

Partimos de _06-media-queries_ instalamos:

```bash
npm install
```

Vamos a dejar el ejemplo inicial:

_./src/app.tsx_

```tsx
import React from "react";
import { jsx, css } from "@emotion/react";

const color = "red";

const h1Class = css`
  color: ${color};
`;

export const App = () => {
  return (
    <div>
      <h1 css={h1Class}>Hello React !!</h1>
    </div>
  );
};
```

Vamos a definir un estilo global (esto podría estar en el root y que un subcomponent lo tuviera):

_./src/app.tsx_

```diff
import React from "react";
- import { jsx, css } from "@emotion/react";
+ import { Global, jsx, css } from "@emotion/react";

const color = "red";

const h1Class = css`
  color: ${color};
`;

+ const globalStyles = css`
+  .base-background {
+    background-color: gray;
+  }
+ `;

export const App = () => {
  return (
    <div>
      <h1 css={h1Class}>
        Hello React !!
      </h1>
    </div>
  );
};

```

Vamos a usarlo en nuestro _h1_ fijate que usamos _className_ para esto:

_./src/app.tsx_

```diff
import React from "react";
- import { jsx, css } from "@emotion/react";
+ import { Global, jsx, css } from "@emotion/react";


const color = "red";

const h1Class = css`
  color: ${color};
`;

+ const globalStyles = css`
+  .base-background {
+    background-color: gray;
+  }
+ `;

export const App = () => {
  return (
+   <div>
+     <Global
+        styles={globalStyles}
+     />
-    <h1 css={h1Class}>Hello React !!</h1>
+    <h1 className="base-background" css={h1Class}>Hello React !!</h1>
+   </div>
  );
};
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
