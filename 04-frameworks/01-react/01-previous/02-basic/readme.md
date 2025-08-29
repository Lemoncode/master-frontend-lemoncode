# 01 Basic - Hola React

Vamos a migrar el [ejemplo terminado de _01-concepts_](https://codesandbox.io/p/sandbox/strange-tdd-evsp07) a react. Para ello vamos a crearnos un codesandbox de react.

Creamos el mismo fichero _./api_

```js
export const getUsers = () => [
  { id: 1955, name: "Rick Sánchez" },
  { id: 8765, name: "Beth Harmon" },
  { id: 7562, name: "Farrokh Bulsara" },
];
```

A continuación, desde el ejemplo que hemos dejado preparado en _01-concepts_ vamos a copiar y pegar _index.js_. Vamos a cambiar únicamente lo que devuelve cada uno de los componentes. El motivo es que en react, los componentes devuelven elementos `jsx`, que no es más que azucar sintáctico de javascript.

**Reemplazamos literales por elementos jsx en los componentes:**

Por ejemplo, en el componente `Header`:

- En código Javascript:

```js
const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};
```

- En código React:

```jsx
const Header = () => {
  return <h4>Lista de usuarios</h4>`
};
```

Si aplicamos el mismo tipo de cambio en el resto de componentes, el fichero _index.jsx_ nos tendría que quedar así:

```jsx
import React from "react";
import { getUsers } from "./api";
import "./styles.css";

const Header = () => {
  return <h4>Lista de usuarios</h4>;
};

const User = ({ user }) => {
  let randomNumber = Math.random();

  setTimeout(() => {
    randomNumber = Math.random();
    console.log(randomNumber);
  }, 3000);

  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};

const List = () => {
  const users = getUsers();
  return <div>{users.map((user) => User({ user }))}</div>;
};

export default function App() {
  return (
    <div>
      {Header()}
      {List()}
    </div>
  );
}
```

Comprobamos que nuestra aplicación renderiza la lista por la pantalla.

**Sintaxis React**
En React vamos a poder usar la sintaxis jsx cuando invocamos nuestros componentes:

```diff
export default function App() {
  return (
    <div>
+     <Header />
+     <List />
-     {Header()}
-     {List()}
    </div>
  );
}
```

Además, si queremos pasar un argumento por props (argumentos de entrada a nuestro componente):

```diff
const List = () => {
  const users = getUsers();
-   return <div>{users.map((user) => User({ user }))}</div>;
+   return <div>{users.map((user) => <User user={user} />)}</div>;
};
```

Al hacer esto, la consola se nos va a lanzar un error que aparece cuando renderizamos elementos iterando por una lista. Como vemos en la traza, nos pide que le pasemos al componente una key con valor único (ya veremos más adelante a que se debe):

```diff
const List = () => {
  const users = getUsers();
-   return <div>{users.map((user) => <User user={user} />)}</div>;
+   return <div>{users.map((user) => <User user={user} key={user.id} />)}</div>;
};
```

Pero Como estamos viendo la variable `randomNumber` sigue estando desincronizada de nuestra interfaz de usuario. Esto se debe a que no estamos guardando ese valor en un estado, por lo que react no se entera del cambio. Para que nuestra aplicación sea reactiva hacemos el siguiente cambio:

```diff
const User = ({ user }) => {
-   let randomNumber = Math.random();
+   const [randomNumber, setRandomNumber] = React.useState(Math.random())


setTimeout(() => {
-    randomNumber = Math.random();
+    setRandomNumber(Math.random());
    console.log(randomNumber);
}, 3000);


  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};
```

Si nos fijamos vemos, que a pesar de que es un setTimeout (debería ejecutarse una sola vez), se está ejecutando cada tres segundos ¿Por qué?

En el código, el setTimeout está dentro del cuerpo del componente. Eso significa que cada vez que el componente se re-ejecuta, React vuelve a crear un nuevo setTimeout.

Cuando el setTimeout se cumple, llamas a setRandomNumber, lo cual cambia el estado. Ese cambio de estado provoca un nuevo renderizado, y en ese nuevo renderizado se vuelve a crear otro setTimeout. Así entras en un bucle infinito:

1. ejecución/render → crea setTimeout.
2. setTimeout → randomNumber cambia estado.
3. React detecta cambio de estado → React ejecuta componente de nuevo.
4. Vuelve al paso 1.

La clave: no es que el setTimeout se repita automáticamente, sino que se vuelve a crear en cada ejecución.

Cuando escribimos lógica directamente dentro de un componente de React, esa lógica se va a ejecutar en cada renderizado. Esto puede generar problemas de rendimiento o incluso bucles infinitos (como en el caso de setTimeout, que se vuelve a crear en cada render).

Para controlar cuándo y con qué condiciones se ejecuta cierto código, React nos proporciona el hook `useEffect`, que nos permite manejar efectos secundarios (side effects), como temporizadores, peticiones a APIs o suscripciones a eventos, de forma controlada.

Su sintaxis es la siguiente:

```jsx
useEffect(() => {
  // 👇 Código (efecto) que quieres ejecutar
}, [dependencias]);
```

Parámetros de useEffect:

- Callback (efecto): la función que queremos ejecutar.
- Lista de dependencias: un array que indica cuándo debe volver a ejecutarse ese callback.

Ejemplos:

- [] → el efecto solo se ejecuta una vez, cuando el componente se monta.
- [estado] → el efecto se ejecuta cada vez que cambia estado.
- undefined → el efecto se ejecuta en cada renderizado. (evitar)

Así, usamos `useEffect` con un array de depencias vacio, porque queremos que el `setTimeout` se ejecute una sola vez, cuando se crea el componente:

```diff
const User = ({ user }) => {
const [randomNumber, setRandomNumber] = React.useState(Math.random())

+   React.useEffect(()=>{
setTimeout(() => {
    setRandomNumber(Math.random());
    console.log(randomNumber);
}, 3000);
+   },[])

  return (
    <div>
      {user.id}: {user.name} - {randomNumber}
    </div>
  );
};
```

Vamos a crear ahora un button que al clicar, me añada un nuevo elemento a mi lista:

```diff
const List = () => {
-   const users = getUsers();
+   Const [users, setUsers] = React.useState(getUsers());

+   const handleClick = () => {
+     setUsers([...users, {id: 1234, name: 'John Doe'}])
+   }

-  return return <div>{users.map((user) => <User user={user} key={user.id} />)}</div>;
+  return (
+    <div>
+      {users.map((user) => (
+        <User user={user} key={user.id} />
+      ))}
+      <button onClick={handleClick}>Add user</button>
+    </div>
+  );
};
```
