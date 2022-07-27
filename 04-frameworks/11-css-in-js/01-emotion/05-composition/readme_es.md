# 05 Composición

## Resumen

Uno de los puntos fuertes de CSS in JS es la facilidad con la
que podemos hacer composición de clases, bye bye especificidad.

## Paso a Paso

Partimos de _04-emotion-css-details_ instalamos:

```bash
npm install
```

Vamos a partir del ejemplo inicial en el que tenemos nuestro
_h1_ en rojo, sustituimos el fichero completo:

_./src/app.tsx_

```tsx
import React from "react";
import { jsx, css } from "@emotion/react";

const h1Class = css`
  color: red;
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

Una forma en la que podemos hacer composición de estilos
es usando interpolación, por ejemplo imaginamoe que tenemos
un estilo que se llama _textBase_, ¿cómo podemos mezclarlo?

```diff
+ const textBase = css`
+  background-color: gray;
+ `;

const h1Class = css`
+ ${textBase}
  color: red;
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

¿Que pasaría si incluyeramos en _textBase_ la propiedad y valor
_color: green_? ¿Como podríamos hacer para que se aplicara desde
del valor _color:red_? Juego con ello, a fin de cuentas es
una interpolación de strings.

Vamos a seguir jugando con la composición, usando _css_ estandar
podemos aplciar varias clases a un elemento, peeeero con la
especificidad nos hemos topado, el orden en que apliquemos las
clases no manda, depende de por ejemlo el orden en el que
hayamos definido las clases en CSS (y otros más como vimos
en el modulo 1 de layout), volvamos por un momento al _css_
estándar y comprendamos el problema, vamos a reemplazar
el contenido completo del fichero:

_./src/app.tsx_

```tsx
import React from "react";

export const App = () => {
  return (
    <div>
      <style>
        {`
          .danger {
            color: red;
          }
          .base {
            background-color: lightgray;
            color: blue;
          }
        `}
      </style>
      <h1 className="base danger">Hello React !!</h1>
    </div>
  );
};
```

¿Qué esta pasando aquí? Que por mucho que en el _h1_ pongamos
_danger_ después de base, en caso de conflicto van a ganar
los estilos de _base_ ¿Por qué? Porque en la definición de los
mismos hemos puesto _base_ primero (es la especificidad amigo :))

Fijate como podemos componer esto con _emotion_:

Definamos la base (reemplazamos el fichero completo):

```tsx
import React from "react";
import { jsx, css } from "@emotion/react";

const danger = css`
  color: red;
`;

const base = css`
  background-color: lightgray;
  color: blue;
`;

export const App = () => {
  return <div></div>;
};
```

Y vamos ahora definir dos _h1_, vamos a componerlos usando un
array, fijate que aquí el orden si importa:

```diff
export const App = () => {
  return (
    <div>
+      <h1 css={[base, danger]}>Aquí el texto sale en rojo (gana danger)</h1>
+      <h1 css={[danger, base]}>Aquí el texto sale en azul (gana base)</h1>
    </div>
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
