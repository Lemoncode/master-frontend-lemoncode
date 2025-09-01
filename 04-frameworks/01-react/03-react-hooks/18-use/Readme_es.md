# 06 AJAX Field Change

## Resumen

Este ejemplo toma como punto de partida el ejemplo \_05-component-update-render.

Pasamos a ver un ejemplo práctico, tenemos un listado de resultado de busqueda
(esto viene de un servidor), y queremos que cada vez que introduzcamos un
cambio en un input de filtrado, envíe una petición a servidor para obtener
la nueva lista filtrada y mostrarla.

Como postre veremos como utilizar Debounce (es decir esperar un poquito a
que el usuario termine de teclear para enviar la petición, ahorrando
así llamadas innecesarias).

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_.

```bash
npm install
```

- Vamos abrir el fichero _demo.js_ y vamos añadir una entrada en el
  estado que almacene el filtro actual de busqueda, y otra en la que almacene
  una lista de usuarios.

_./src/demo.tsx_

```tsx
import React from "react";

export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
  const [userCollection, setUserCollection] = React.useState([]);

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

- Ahora vamos a acceder a un rest api json, _typicode_ nos da alguna gratuita,
  esta por ejemplo: _https://jsonplaceholder.typicode.com/users_ además permite
  aplicar filtrados, la ponemos en el useEffecy y le añadimos como filtro que
  se ejecute cada vez que se cambie el filtro de busqueda:

```diff
export const MyComponent = () => {
  const [filter, setFilter] = React.useState('');
  const [userCollection, setUserCollection] = React.useState([]);

+  // Load full list when the component gets mounted and filter gets updated
+  React.useEffect(() => {
+    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
+        .then(response => response.json())
+        .then(json => setUserCollection(json));
+  }, [filter]);

  return (
```

**OJO !!! Typicode** corre en un heroku gratuito que se duerme cada X tiempo :)
Vamos a probar con otras API.

Ojo, que esto impactara en el codigo, tenemos que meter algún cambio y
ver que devuelven estas api, esto lo haremos como ejercicio.

**EJERCICIO RICK AND MORTY API**

https://rickandmortyapi.com/

https://swapi.dev/documentation#auth

```tsx
React.useEffect(() => {
  fetch(`https://swapi.dev/api/people?search=${filter}`)
    .then((response) => response.json())
    .then((json) => setUserCollection(json.results));
}, [filter]);
```

- Si ejecutamos este código podemos ver que la opcíon de filtrado funciona.

```bash
npm start
```

## BONUS

### A. useDebounce

Esto está bien, pero no es optimo, normalmente queremos disparar la busqueda
justo cuando el usuario ha dejado de teclear para evitar hacer llamadas
innecesarias.

Nos podemos bajar una librería que implement un custom hook que hace
justo eso: https://github.com/xnimorz/use-debounce

Lo único que tendríamos que hacer:

```bash
npm install use-debounce --save
```

```diff
+ import { useDebounce } from 'use-debounce';

export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
+ const [debouncedFilter] =   useDebounce(filter, 500);
  const [userCollection, setUserCollection] = React.useState([]);

  // Load full list when the component gets mounted and filter gets updated
  React.useEffect(() => {
-    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${filter}`)
+    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${debouncedFilter}`)

      .then((response) => response.json())
      .then((json) => setUserCollection(json));
-  }, [filter]);
+  }, [debouncedFilter]);
```

### B. useDeferredValue

En React 18 han metido un nuevo hook interesante y es poder
jugar actualizando a dos tiempos:

- En el debounce nosotros artificialmente esperamos a
  que el usuario deje de teclear para actualizar.

- En useDeffered lo que hacemos es actualizar un valor con
  un retraso.

Esto nos puede servir cuando tenemos operaciones que pueden
tardar más (por ejemplo pedir listad de fotos a una api , versus
rellenar el texto de busqueda que queremos).

Vamos a cambiar el uso de useDebounce por useDeferredValue:

```diff
export const MyComponent = () => {
  const [filter, setFilter] = React.useState("");
  const [userCollection, setUserCollection] = React.useState([]);
-  const [debouncedFilter] = useDebounce(filter, 500);
+  const deferredFilter = React.useDeferredValue(filter, {timeoutMs:500 });
```

```diff
  React.useEffect(() => {
    fetch(
-      `https://jsonplaceholder.typicode.com/users?name_like=${debouncedFilter}`
+      `https://jsonplaceholder.typicode.com/users?name_like=${deferredFilter}`

    )
      .then((response) => response.json())
      .then((json) => setUserCollection(json));
-  }, [debouncedFilter]);
+  }, [deferredFilter]);

```

Aquí no vemos mucho efecto, esto es más para da prioridades de renderizado.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
