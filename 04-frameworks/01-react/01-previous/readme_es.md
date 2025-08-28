# 01 Previo - Hola React

## Resumen

En este ejemplo vamos a crear un _codesandbox_ para entender los primeros conceptos de React y los motivos principales por los que necesitamos una librería como esta.
[Aquí tenéis el ejemplo completo que vamos a desarrollar.](https://codesandbox.io/p/sandbox/react-concepts-rncyq4?file=%2Fsrc%2Findex.js%3A36%2C1)

Para comenzar, partiremos de un proyecto en vanilla JavaScript e iremos añadiendo poco a poco funcionalidades que nos acerquen al enfoque que propone React. El objetivo es ver cómo React resuelve de forma más elegante y potente problemas comunes del desarrollo web.

## Paso a paso

- Renombramos el archivo _index.mjs_ a _index.js_ y actualizamos la referencia en _index.html_.
- Comentamos todo el contenido de _index.js_.
- En el fichero _index.html_ vamos a renderizar de forma estática una lista de usuarios:

_index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Sandbox</title>
    <meta charset="UTF-8" />
  </head>

  <body>
-    <div id="app"></div>
+    <div id="app">
+      <h4>Lista de usuarios</h4>
+      <div>1955: Rick Sánchez</div>
+      <div>8765: Beth Harmon</div>
+      <div>7562: Farrokh Bulsara</div>
+    </div>
    <script src="./index.js" type="module"></script>
  </body>
</html>
```

Esto funciona, pero frameworks como React nos ofrecen un enfoque distinto: permiten transformar dinámicamente el DOM en el cliente. Así, el servidor solo entrega un HTML básico junto con un archivo JavaScript que genera la interfaz.

Dejamos el HTML vacío y movemos la lista a nuestro archivo _index.js_:

_index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Sandbox</title>
    <meta charset="UTF-8" />
  </head>

  <body>
+    <div id="app"></div>
-    <div id="app">
-      <h4>Lista de usuarios</h4>
-      <div>1955: Rick Sánchez</div>
-      <div>8765: Beth Harmon</div>
-      <div>7562: Farrokh Bulsara</div>
-    </div>
    <script src="./index.js" type="module"></script>
  </body>
</html>
```

Yn en _index.js_:

```diff
+   import "./styles.css";

+   document.getElementById("app").innerHTML = `
+     <h4>Lista de usuarios</h4>
+     <div>1955: Rick Sánchez</div>
+     <div>8765: Beth Harmon</div>
+     <div>7562: Farrokh Bulsara</div>
+   `;
```

Ahora el contenido lo genera JavaScript. Comprobamos que es el fichero de JavaScript el que me genera el contenido.

### Componentes

Vamos a ir partiendo nuestra lista en partes. Para ello primero segregamos el título:

```diff
 import "./styles.css";

+   const Header = () => {
+     return ` <h4>Lista de usuarios</h4>`;
+   };
+
    document.getElementById("app").innerHTML = `
-       <h4>Lista de usuarios</h4>
+       ${Header()}
        <div>1955: Rick Sánchez</div>
        <div>8765: Beth Harmon</div>
        <div>7562: Farrokh Bulsara</div>
```

A esta función que acabamos de crear, en React, la vamos a llamar componente. Es decir, **en React los componentes son funciones.** Por el momento este componente nos devuelve un trocito de nuestra aplicación, en este caso el título, que renderiza algo en el DOM.

Vamos a seguir rompiendo o componentizando nuestra aplicación. Vamos a crear un componente nuevo que nos devuelva la lista únicamente.

```diff
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

+   const List = () => {
+     return `
+       <div>
+         <div>1955: Rick Sánchez</div>
+         <div>8765: Beth Harmon</div>
+         <div>7562: Farrokh Bulsara</div>
+       </div>`;
+   };

document.getElementById("app").innerHTML = `
    ${Header()}
-       <div>1955: Rick Sánchez</div>
-       <div>8765: Beth Harmon</div>
-       <div>7562: Farrokh Bulsara</div>
+       ${List()}
`;
```

### Props

Vamos a crear ahora un componente que me renderice en el DOM, cada usuario. Para ello vamos a crear un componente (función) que reciba un objeto usuario con un `id` y un `name`:

```diff
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

+   const User = (props) => {
+     return `<div>${props.id}: ${props.name}</div>`;
+   };

const List = () => {
  return `
    <div>
+         ${User({id: 1955, name 'Rick Sánchez'})}
+         ${User({id: 8765, name 'Beth Harmon'})}
+         ${User({id: 7562, name 'Farrokh Bulsara'})}
-         <div>1955: Rick Sánchez</div>
-         <div>8765: Beth Harmon</div>
-         <div>7562: Farrokh Bulsara</div>
    </div>`;
};

document.getElementById("app").innerHTML = `
    ${Header()}
    ${List()}
`;
```

En el argot de react los argumentos de entrada que les pasamos a los componentes se les conoce por el nombre de `props`. Un poco más adelante veremos que además, en React, la sintaxis para ejecutar un componente es muy distinta a ésta. Sin embargo, es muy importante tener presente que a pesar de que esta sintaxis sea distinta, al final lo que estamos haciendo es invocar funciones y pasándoles argumentos de entrada.

Vamos a acercarnos un poquito más a lo que haría una aplicación real y a simular que los datos que estamos mostrando por la lista nos llegan de una API. Para ello vamos a crearnos un fichero _./api.js_.

```js
export const getUsers = () => [
  { id: 1955, name: "Rick Sánchez" },
  { id: 8765, name: "Beth Harmon" },
  { id: 7562, name: "Farrokh Bulsara" },
];
```

Al invocarlo dentro de la función `List` podemos usar directamente un método `map` para poder ejecutar la función `User` por cada uno de los elementos del array, sean los que sean.

```diff
+ import { getUsers } from './api';
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

+   const User = (props) => {
+     return `<div>${props.id}: ${props.name}</div>`;
+   };

const List = () => {
+   const users = getUsers();
  return `
    <div>
+         ${users.map(user=>User(user)).join('')}
-         ${User({id: 1955, name 'Rick Sánchez'})}
-         ${User({id: 8765, name 'Beth Harmon'})}
-         ${User({id: 7562, name 'Farrokh Bulsara'})}
    </div>`;
};

document.getElementById("app").innerHTML = `
    ${Header()}
    ${List()}
`;
```

En react sin embargo el argumento `props` es un único parámetro, un objeto al que voy a poder pasarle todo lo que quiera. Adaptamos el código.

```diff
import { getUsers } from "./api";
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

-   const User = (props) => {
+   const User = ({ user }) => {
-     return `<div>${props.id}: ${props.name}</div>`;
+     return `<div>${user.id}: ${user.name}</div>`;
};

const List = () => {
  const users = getUsers();
  return `
    <div>
-        ${users.map((user) => User(user)).join("")}
+        ${users.map((user) => User({ user })).join("")}
    </div>`;
};

document.getElementById("app").innerHTML = `
    ${Header()}
    ${List()}
`;
```

### Reactividad

Vamos a intentar renderizar por cada elemento un número random, que se calcule en el momento en el que se invoque nuestro componente.

```diff
const User = ({ user }) => {
+     const randomNumber = Math.random();
-     return `<div>${user.id}: ${user.name}</div>`;
+     return `<div>${user.id}: ${user.name} - ${randomNumber}</div>`;
};
```

Si lo actualizamos con un setTimeout, vemos que el valor cambia en consola, pero la interfaz no se actualiza:

```diff
const User = ({ user }) => {
-  const randomNumber = Math.random();
+  let randomNumber = Math.random();
+  setTimeout(() => {
+    randomNumber = Math.random();
+    console.log(randomNumber);
+  }, 3000);
  return `<div>${user.id}: ${user.name} - ${randomNumber}</div>`;
};
```

¿Por qué transcurridos los tres segundos del setTimeout la interfaz de nuestra aplicación no se refresca? Intentad pensar la respuesta...

La explicación es sencilla: las funciones se ejecutan únicamente una vez. En ese momento devuelven un return que genera un fragmento de HTML. Ese resultado inicial es el que se inyecta en el DOM y no vuelve a cambiar, aunque la lógica interna de la función (como el valor de `randomNumber`) sí se modifique posteriormente.

Si observamos la consola, veremos que el valor de `randomNumber` efectivamente se recalcula, pero la interfaz no refleja ese cambio. Esto ocurre porque el DOM no está vinculado de manera automática a los datos de nuestra aplicación.

Y aquí es donde entran en juego librerías como React. Su principal valor es que incorporan reactividad: permiten mantener sincronizados el estado de la aplicación y la interfaz de usuario.

En React, los estados son la pieza clave para persistir y gestionar datos. Cada vez que un estado cambia, React vuelve a ejecutar los componentes que dependen de él, asegurando que la interfaz se actualice y quede alineada con la información más reciente.

### Eventos y persistencia

```diff
const List = () => {
-  const users = getUsers();
+  let users = getUsers();

+  const handleClick = () => {
+    alert("button clicked!");
+    users = [...users, { id: 1234, name: "John Doe" }];
+  };

  return `
    <div>
         ${users.map((user) => User({ user })).join("")}
+        <button onclick="javascript:handleClick()">Add user</button>
    </div>`;
};
```

El botón aparece pero al clicar en él, no aparece ni siquiera el alert. ¿Qué está pasando?
De nuevo, cuando `List` se ejecuta, la función `handleClick` se crea. Sin embargo, esa función no se ejecuta hasta que clicamos en el botón y cuando esto ocurre, la función ya no existe, porque la función `List` se ha ejecutado y ha muerto.

Este es otro de los problemas que va a venir a solucionar React, ya que nos va a permitir, persistir datos, funciones entre ejecución y ejecución de nuestros componentes.
