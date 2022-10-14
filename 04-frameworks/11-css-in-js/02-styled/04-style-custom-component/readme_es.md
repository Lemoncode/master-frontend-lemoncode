# 03 Estilando un componente custom

## Resumen

Hasta ahora siempre hemos estilado

## Paso a Paso

- Primero copiamos el ejemplo _02-props_ que está en el raíz
  del proyecto, y hacemos un _npm install_

```bash
npm install
```

- Vamos a montar el siguioente ejemplo:

_./src/app.tsx_

```tsx
import React from "react";
import styled from "styled-components";

const Link: React.FC = ({ children }) => {
  return <a>{children}</a>;
};

export const App = () => {
  return <Link>Soy un enlace normal</Link>;
};
```

Vamos a hacer estilable este enlace:

```diff
import React from "react";
import styled from "styled-components";

+ interface Props {
+   className? : string;
+ }

- const Link: React.FC = ({ children }) => {
+ const Link: React.FC<Props> = ({ className, children }) => {

-  return <a>{children}</a>;
+  return <a className={className}>{children}</a>;
};

export const App = () => {
  return <Link>Soy un enlace normal</Link>;
};
```

Y ahora vamos a crear una versión estilada:

```diff
interface Props {
  className?: string;
}

const Link: React.FC<Props> = ({ className, children }) => {
  return <a className={className}>{children}</a>;
};

+ const StyledLink = styled(Link)`
+  color: blue;
+  font-weight: bold;
`;

export const App = () => {
-  return <Link>Soy un enlace normal</Link>;
+  return (
+    <div>
+     <Link>Soy un enlace normal</Link>
+     <StyledLink>Hola estoy estilado</StyledLink>
+    </div>
+  );
};
```

¿Y que pasaría si el componente tuviera varios subcomponentes? Imaginate que tenemos el siguiente
subcomponente:

```diff
import React from "react";
import styled from "styled-components";

interface Props {
  className?: string;
}

const Link: React.FC<Props> = ({ className, children }) => {
-  return <a className={className}>{children}</a>;
+  return (
+     <div className={className}>
+      <a>{children}</a>
+     </div>
+ )
};
```

Imaginate que queremos mostrar el _div_ con color
de fondo gris y el anchor con un color azul.

```diff
const StyledLink = styled(Link)`
-  color: blue;
-  font-weight: bold;
+  background-color: gray;
+  & a {
+    color: blue;
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
