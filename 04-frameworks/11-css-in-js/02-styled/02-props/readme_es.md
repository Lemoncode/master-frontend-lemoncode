# 03 Props styling

## Resumen

Algo muy potente de styled components es que podemos estilar dinámicamente consultando
las props de un compenente.

En este ejempo vamos a tener un h1 que pondremos de color verde, y si al componente
instanciado le pasamos la propiedad _alert_ a true

## Paso a Paso

- Primero copiamos el ejemplo _01-basic_ que está en el raíz
  del proyecto, y hacemos un _npm install_

```bash
npm install
```

- Vamos a jugar con una propiedad _alert_ que va a ser booleana,fijate
  que aquí en la interpolación pasamos una función:

_./src/app.tsx_

```diff
import React from "react";
import styled from "styled-components";

+ interface ButtonProps {
+   alert? :boolean;
+ }

const H1 = styled.h1<ButtonProps>`
-  color: red;
+  color: ${(props : ButtonProps) => props.alert ? "red" : "green"}
`;

export const App = () => {
-  return <H1>Hello React !!</H1>;
+  return (
+    <>
+      <H1>Hello React !!</H1>
+      <H1 alert>Hello React !!</H1>
+    </>
+   );
};
```

Otra cosa que podríamos hacer es directamente pasarle el color en una prop:

```diff
import React from "react";
import styled from "styled-components";

interface ButtonProps {
-  alert?: boolean;
+  color: string;
}

const H1 = styled.h1<ButtonProps>`
-  color: ${(props : ButtonProps) => props.alert ? "red" : "green"}
+  color: ${(props) => props.color};
`;

export const App = () => {
+ const [tempColor, setTempColor] = React.useState('black');
+ const [color, setColor] = React.useState(tempColor);


  return (
    <>
+     <input value={tempColor} onChange={e => setTempColor(e.target.value)}/>
+      <button onClick={() => setColor(tempColor)}>Change</button>
+      <H1 color={color}>Hello React !!</H1>
-      <H1>Hello React !!</H1>
-      <H1 alert>Hello React !!</H1>
    </>
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
