# 01 Emotion Rough

## Resumen

Vamos a usar _emotion_ sin depende de react.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Instalamos _@emotion/css_

```bash
npm install @emotion/css
```

Vamos a estilar...

_./src/app.tsx_

```diff
import React from "react";
+ import {css} from '@emotion/css';

+ const color= 'red';

+ const h1Class = css`
+   color: ${color}
+ `;


export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <h1 className={h1Class}>Hello React !!</h1>
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
