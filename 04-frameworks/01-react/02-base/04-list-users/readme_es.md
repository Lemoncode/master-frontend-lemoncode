# 04 List Users

## Resumen

Este ejemplo toma como punto de partida el ejemplo _03-webpack-react_.

Vamos a pedirle a la API de Github la lista de miembros que pertenece a una
organización y vamos a mostrarla por pantalla.

Este ejemplo lo vamos a hacer de forma rápida y sucia, en el siguiente lo
refactorizaremos para aprovechar las ventajas que nos ofrece trabajar
con TypeScript y como hacer nuestro código más mantenible.

Que vamos a aprender en este ejemplo:

- Cómo crear un componente de visualización sin tener que depender de leer
  de una fuenta remota.
- Cómo iterar y mostrar una lista de resultados.
- Cómo hacer una llámada asícnrona para pedir datos a una api remota.
- Cómo meter estos datos en el estado de nuestro componente en React.

Pasos:

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Si queremos ver que tipo de datos vamos a manejar, podemos abrir el
  navegador web y ver que devuelve la API Rest de Github

```bash
https://api.github.com/orgs/lemoncode/members
```

- Vamos a crear un set de datos parecido que mueste dos miembros de una organización.

_./src/app.js_

```diff
import React from "react";

+ const membersMock = [
+  {
+     id: 14540103,
+     login: "antonio06",
+     avatar_url: "https://avatars1.githubusercontent.com/u/14540103?v=4"
+  },
+  {
+     id: 1457912,
+     login: "brauliodiez",
+     avatar_url: "https://avatars1.githubusercontent.com/u/1457912?v=4"
+  },
+  ];

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

- Ahora que tenemos los datos, vamos a añadirle estado a nuestro componente
  y cargarle estos datos por defecto.

_./src/app.js_

```diff
export const App = () => {
+ const [members, setMembers] = React.useState(membersMock);

  return <h1>Hello React !!</h1>;
};
```

- Ya tenemos los datos en nuestro estado, vamos a mostrar el primero elemento
  y vemos si el nombre que aparee por pantalla es _antonio06_:

_./src/app.js_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

+  return <span>{members[0].login}</span>

-  return <h1>Hello React !!</h1>;
};
```

- Probamos:

```bash
npm start
```

- Esto no esta mal, pero igual la lista no trae elementos, que igual puede traer 5, ¿Cómo iterar por los
  elementos de la lista? Usando _map_ de ES6.

_./src/app.js_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

-  return <span>{members[0].login}</span>;
+  return (
+    members.map((member) =>
+       <span key={member.id}>{member.login}</span>
+    )
+  )
};
```

Con estas líneas de código, estamos iterando por el array de miembros y creado un elemento span por cada entrada,
a tener en cuenta:

- key: cuando creamos elementos de forma dinámica hace falta añadirles una clave única (así React puede optimizar
  el renderizado).

- Member Login: leemos el valor del elemento actual de array y mostramos el campo login.

- Ahora que vemos que funciona vamos a encajar esto en un tabla:

_./src/app.js_

```diff
export const App = () => {
  const [members, setMembers] = React.useState(membersMock);

-  return members.map((member) => <span key={member.id}>{member.login}</span>);
+  return (
+          <table className="table">
+            <thead>
+                <tr>
+                    <th>
+                        Avatar
+                    </th>
+                    <th>
+                        Id
+                    </th>
+                    <th>
+                        Name
+                    </th>
+                </tr>
+            </thead>
+            <tbody>
+           {members.map((member) => (
+              <tr>
+                <td>
+                  <img src={member.avatar_url} style ={{width: '5rem'}}/>
+                </td>
+                <td>
+                  <span>{member.id}</span>
+                </td>
+                <td>
+                  <span>{member.login}</span>
+                </td>
+              </tr>
+          ))}
+        </tbody>
+      </table>
+  )
};
```

Fijaros aquí hemos creado una tabla, con su cabecera y iterado por todo los elementos de la colección
creando una fila en la tabla por cada elemento de la fila.

- Hasta aquí muy bien pero... yo quiero tirar de la API de Github no de datos mockeados, vamos a empezar
  por eliminar los datos mock e inicializar el estado de nuestro componente a un array vacio:

```diff
- const membersMock = [
-  {
-    id: 14540103,
-    login: "antonio06",
-    avatar_url: "https://avatars1.githubusercontent.com/u/14540103?v=4",
-  },
-  {
-    id: 1457912,
-    login: "brauliodiez",
-    avatar_url: "https://avatars1.githubusercontent.com/u/1457912?v=4",
-  },
- ];

export const App = () => {
-  const [members, setMembers] = React.useState(membersMock);
+  const [members, setMembers] = React.useState([]);
```

- ¿Cómo puedo hacer la llamada al servidor de Github y traerme los datos justo cuando el compomenten se monte en mi HTML?
  Para ello vamos a usar _useEffect_ esto lo veremos más adelante cuando cubramos la parte de hooks

_./src/app.tsx_

```diff
export const App = () => {
  const [members, setMembers] = React.useState([]);

+  React.useEffect(() => {
+  }, []);

  return (
```

Aquí ejecutamos un código justo cuando el componente se monta el DOM, los corchetes que nos encontramos al final de useEffect
son los que indican que sólo se ejecute una sóla vez al montarse el componente, aprenderemos como funciona esto en detalle más adelante.

- Ahora nos queda realizar la llamada AJAX dentro de ese _useEffect_

_./src/app.tsx_

```diff
  React.useEffect(() => {
+    fetch(`https://api.github.com/orgs/lemoncode/members`)
+      .then((response) => response.json())
+      .then((json) => setMembers(json));
  }, []);
```

¿Qué estamos haciendo aquí? Estamos haciendo una llamada a la API REST de Github, esta api es asíncrona (de ahí que utlicemos
promesas), primero parseamos el resultado a _json_ y después asignamos ese resultado al estado de nuestro componente
invocando a _setMembers_

- Si arrancamos el proyecto veremos como ahora está realizando la carga de servidor.

```bash
npm start
```
