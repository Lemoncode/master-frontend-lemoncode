# 12 asyncClosure

## Resumen

Este ejemplo toma como punto de partida el ejemplo _11-use-context_.

Uno de los prerequisitos fundamentales para poder aprender React es tener
unos conocimientos sólidos de Javascript y ES6. En este caso tener muy
claro el concepto de _closure_.

Los componentes funcionale son eso, funciones:

- Se invocan.
- Se ejecutan.
- Mueren.

Si recordamos el concepto de closure, cuadno tenía una llamada asíncrona
me permitía en la respuesta acceder a variables de la funcíon padre que la
había invocado aunque está función estuviera ya muerta.

Si aplicamos este concepto a React, nos podemos encontrar con un caso curioso:

- Imagina que tenemos en un estado un valor de descuento.
- Hacemos una llamada asíncrona al servidor para que nos de el total del pedido.
- Mientras que la llamada está en curso el campo de descuento cambia.
- En la respuesta del servidor multiplicamos el total del pedido por el descuento.

¿ Qué valor de descuento crees que aplicará el antiguo o el nuevo? ... Bingo, el
antiguo ¿Porqué? ... pensemnos en un closure, no dejamos de tener una función padre
que se ha muerto, que mantiene los valores por el principio de closure y que lee
los valores que tuviera en ese momento ¿ Qué pasa con los nuevos valores se generan
en otra vida... es decir en otra llamada a la función donde todo vuelve a arrancar).

Para poder resolver este caso arista, React nos proporciona el hook _userRef_

Veamos como funciona.

¿ Qué pasa si yo hago una llamada asíncrona dentro de un _useEffect_?

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Antes de arrancarnos vamos a quitar el use del contexto en el fichero _app.tsx_,
  esto es algo que viene del ejemplo anterior (si partes de otro ejemplo puede que
  no te haga falta).

_./src/app.tsx_

```diff
import React from "react";
- import { MyComponent, MyContextProvider } from "./demo";
+ import { MyComponent } from "./demo";


export const App = () => {
  return (
-    <MyContextProvider>
      <MyComponent />
-    </MyContextProvider>
  );
};
```

- Vamos a por el ejemplo, ¿ Qué vamos a hacer?

En cuanto a datos:

- Vamos a tener un contador de segundos, lo guardamos en el estado.
- Vamos a tener un mensaje para mostrar los segundos que hay.

En cuanto a funcionalidad:

- Cuando montamos por primera vez el componetente el valuro de segundos va a ser 0.
- Cuando pase un segundo vamos a setear el valor de segundos a 1.
- Cuando pasen dos segundos vamos a setear el valor del mensaje
  (que muestra esos segundos).

En el componente:

- Mostramos el número de segundos.
- Mostramos el mensaje.

> Este caso está hecho para ver como funciona _useRef_ se podría
> resolver de otras maneras más óptimas.

_./src/demo.tsx_

```jsx
import React from "react";

export const MyComponent = () => {
  const [message, setMessage] = React.useState("initial message");
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      console.log(seconds);
      setSeconds(1);
    }, 1000);

    setTimeout(() => {
      setMessage(`Total seconds: ${seconds}`);
    }, 2000);
  }, []);

  return (
    <>
      <h3>{message}</h3>
      <h4>{seconds}</h4>
    </>
  );
};
```

Si no estuvieramos al tanto del problema con las closures, esperaríamos
que el mensaje final fuera "Total segundos: 1", pero lo ejecutaremos y veremos que
el mensaje que aparece por pantalla es "Total segundos: 0"

Para solucionar esto, los chicos de Facebook nos proveed del hook _useRef_, esto hook:

- Almacena un valor de inicialización (igual que con useState).
- Nos devuelve un objeto.
- Dicho objeto tiene una propiedad _current_ que es una variable mutable
  (aquí se almacenaría el valor de los segundos), si modificamos este valor
  en un render futuro, se tendrá cuenta en uno pasado (una llamada asíncrona.)
- Cuando viene otro render, _useRef_ devuelve la misma instancia del objeto.

Veamoslo en acción:

_./src/demo.tsx_

```diff
import React from "react";

export const MyComponent = () => {
  const [message, setMessage] = React.useState("initial message");
  const [seconds, setSeconds] = React.useState(0);

+ const secondsRef = React.useRef(seconds);

  React.useEffect(() => {
    setTimeout(() => {
      console.log(seconds);
      setSeconds(1);
+      secondsRef.current = 1;
    }, 1000);

    setTimeout(() => {
-      setMessage(`Total seconds: ${seconds}`);
+      setMessage(`Total seconds: ${secondsRef.current}`);
    }, 2000);
  }, []);

  return (
    <>
      <h3>{message}</h3>
      <h4>{seconds}</h4>
    </>
  );
};
```

- Si lo ejecutamos, veremos como ahora funciona correctamente.

```bash
npm start
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
