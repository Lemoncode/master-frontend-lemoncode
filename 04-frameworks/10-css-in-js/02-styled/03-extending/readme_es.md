# 03 Extending styles

## Resumen

Otro tema interesante es el de poder extender las propiedades de un control.

Vamos a seguir jugando con nuestro _h1_

## Paso a Paso

- Primero copiamos el ejemplo _02-props_ que está en el raíz
  del proyecto, y hacemos un _npm install_

```bash
npm install
```

- Vamos a volver al ejemplo original:

_./src/app.tsx_

```tsx
import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
  color: red;
`;

export const App = () => {
  return <H1>Hello React !!</H1>;
};
```

Y vamos a cambiar la clase base y crear una extensión:

```diff
import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
+ background: gray;
+ color: green;
-  color: red;
`;

+ const H1Alert = styled(H1)`
+   color: red;
+ `;
```

Y ahora vamos a usarlo:

```diff

export const App = () => {
-  return <H1>Hello React !!</H1>;
+  return (
+    <>
+    <H1>Hello React !!</H1>
+    <H1Alert>Alert H1</H1Alert>
+    </>
+  )
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
