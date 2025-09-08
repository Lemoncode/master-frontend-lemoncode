# 06 Use hook

Vamos a ver el nuevo hook _use_, introducido en la versión 19 de react. En este ejemplo vamos a usar el hook para consumir datos que recibimos de manera asíncrona, haciendo una petición al servidor.

## Punto de Partida

Este ejemplo parte del ejercicio _06-ajax-field-change_. Si no tienes el código a mano te lo dejamos por aquí.

_./src/demo.tsx_

```tsx
import React from "react";

export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
  const [userCollection, setUserCollection] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
      .then((response) => response.json())
      .then((json) => setUserCollection(json));
  }, [filter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

_./src/app.tsx_

```tsx
import React from "react";
import { MyComponent } from "./demo";

export const App = () => {
  return <MyComponent />;
};
```

## Paso a Paso

Primero hacemos un _npm install_.

```bash
npm install
```

Lo primero que necesitamos es una llamada asíncrona. Vamos a crearnos por el momento una llamada que no ataque a ningún servidor, sino que simplemente devuelva usuarios mockeados. Introducimos además un log para ver cuantas veces se ejecuta la función.

En _./src/demo.tsx_

```diff
import React from "react";

+ const fetchMockedUsers = async () => {
+   console.log("executed");
+   const res = await Promise.resolve([{ name: "Test user", id: 1 }]);
+   return res;
+ };

export const MyComponent = () => {
```

El hook use se va a encargar de gestionar la llamada y de devolvernos el estado, por lo que podemos reemplazar el useState y el useEffect.

En _./src/demo.tsx_

```diff
- import React from "react";
+ import React, { use } from "react";


export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
+  const userCollection = use(fetchMockedUsers())
-  const [userCollection, setUserCollection] = React.useState([]);

-  React.useEffect(() => {
-    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
-      .then((response) => response.json())
-      .then((json) => setUserCollection(json));
-  }, [filter]);

  return (
```

Si levantamos el proyecto, abrimos las _devTools_ y vemos los logs del browser, nos damos cuenta de que hemos entrado en un bucle infinito (el log aparece muchas veces). Esto se debe a como funciona el hook _use_ por dentro y a que nos hemos saltado una regla fundamental establecida por la documentación de React: al hook _use_ hay que pasarle una referencia estable.
Esto se diferencia a lo que hemos hecho dentro de nuestro componente, donde dentro de cada ejecución _fetchMockedUsers()_ crea una nueva referencia en cada re-ejecución, por lo que el componente se va a re-ejecutar infinitas veces.

Para poder adaptarnos a las condiciones de uso de _use_ esa referencia debe ser estable, por lo que le deberá llegar a nuestro componente como _prop_. De esta manera esa _prop_ no se calculará en cada ejecución.

Así, nos creamos un componente padre _MyParentComponent_ que wrapee a _MyComponent_.

- Movemos _fetchMockedUsers_ a este fichero
- Creamos User interface.
- Introducimos _Suspense_, requerido para poder usar _use_. Este componente nos permitirá usar un fallback mientras la llamada está pendiente de resolverse.

_./src/parent.tsx_

```tsx
import React, { Suspense } from "react";
import { MyComponent } from "./demo";

export interface User {
  id: number;
  name: string;
}

const fetchMockedUsers = async () => {
  console.log("executed");
  const res = await Promise.resolve([{ name: "Test user", id: 1 }]);
  return res;
};

export const MyParentComponent = () => {
  const mockedUsersPromise = fetchMockedUsers();
  return (
    <>
      <Suspense fallback={<>Loading</>}>
        <MyComponent userPromise={mockedUsersPromise} />
      </Suspense>
    </>
  );
};
```

Actualizamos en _./src/demo.tsx_:

- Tipamos _MyComponent_ correctamente.
- _MyComponent_ recibe la nueva prop.
- Eliminamos _fetchMockedUsers_.

```diff
import React, { use } from "react";
+   import { User } from './parent';

-   export const fetchMockedUsers = async () => {
-     console.log("executed");
-     const res = await Promise.resolve([{ name: "Test user", id: 1 }]);
-     return res;
-   };

+   interface MyComponentProps {
+     userPromise: Promise<User[]>
+   }

-   export const MyComponent = () => {
+   export const MyComponent: React.FC<MyComponentProps> = ({ userPromise }) => {
      const [filter, setFilter] = React.useState("");
-     const userCollection = use(fetchMockedUsers());
+     const userCollection = use(userPromise);

      return (
```

Reemplazamos en _./src/app.tsx_

```diff
import React from "react";
-   import { MyComponent } from "./demo";
+   import { MyParentComponent } from "./parent";

export const App = () => {
-     return <MyComponent />;
+     return <MyParentComponent />;
};
```

Comprobamos que la aplicación funciona.

Ahora que ya sabemos que no estamos incurriendo en bucles infinitos es seguro sustituir la función mock por la llamada real. Además, al estar interpolando dentro de la llamada _filter_, nos tenemos que traer el estado y el input que lo setea.

_./src/parent.tsx_

```diff
export interface User {
  id: number;
  name: string;
}

-   const fetchMockedUsers = async () => {
-     console.log("executed");
-     const res = await Promise.resolve([{ name: "Test user", id: 1 }]);
-     return res;
-   };

+   const fetchUsers = async (filter): Promise<User[]> => {
+     const res = await fetch(
+       `https://jsonplaceholder.typicode.com/users?name_like=${filter}`
+       );
+     return res.json();
+   };

export const MyParentComponent = () => {
+    const [filter, setFilter] = React.useState("");
-     const mockedUsersPromise = fetchMockedUsers();
+     const usersPromise = fetchUsers(filter);

  return (
    <>
+     <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Suspense fallback={<>Loading</>}>
-        <MyComponent userPromise={mockedUsersPromise} />
+        <MyComponent userPromise={usersPromise} />
      </Suspense>
    </>
  );
};
```

Eliminamos de _MyComponent_, el estado _filter_ y el input que lo setea:

_./src/demo.tsx_

```diff
export const MyComponent: React.FC<MyComponentProps> = ({ userPromise }) => {
-     const [filter, setFilter] = React.useState("");
      const userCollection = use(userPromise);

      return (
        <div>
-         <input value={filter} onChange={(e) => setFilter(e.target.value)} />
        <ul>
```

Y si quisiéramos implementar el useDebounce?

- Instalamos la librería _use-debounce_ como dependencia

```bash
npm i use-debounce
```

En _./src/parent.tsx_:

```diff
import React, { Suspense } from "react";
+   import { useDebounce } from "use-debounce";

(...)

export const MyParentComponent = () => {
  const [filter, setFilter] = React.useState("");
+   const [debouncedFilter] = useDebounce(filter, 1500);
-   const usersPromise = fetchUsers(filter);

+  const usersPromise = React.useMemo(
+    () => fetchUsers(debouncedFilter),
+    [debouncedFilter]
+  );

  return (
    <>
+     <div>Debounced filter: {debouncedFilter}</div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <Suspense fallback={<>Loading</>}>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
