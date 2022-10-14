# 03 Hello Styled components

## Resumen

Vamos a hacer una tour de introducción a Styled Components.

En este ejemplo harems un "hola styled", instalación y uso mínimo.

## Paso a Paso

- Primero copiamos el ejemplo _00-boiler-react_ que está en el raíz
  del proyecto, y hacemos un _npm install_

```bash
npm install
```

- Vamos ahora a instalar la librería:

```bash
npm install styled-components --save
```

Y sus typings

```bash
npm install @types/styled-components --save-dev
```

> En un proyecto real instalaremos también _styled-components-babel-plugin_,
> así podemos tener nombres de clases más legibles, server side rendering,
> bundles más pequeños...

Vamos ahora a usar _styled components_ en nuestro componente _h1_

_./src/app.tsx_

```diff
import React from "react";
+ import styled from 'styled-components';

+ const H1 = styled.h1`
+   color: red
+ `;

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <H1>Hello React !!</H1>;
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
