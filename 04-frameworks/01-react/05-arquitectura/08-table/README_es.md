# 08 Tabla

Vamos a mostrar una tabla de empleados desde la que vamos a permitir
ejecutar una serie de comandos.

# Pasos

- Copiate el ejemplo anterior _07-dashboard_ y haz un _npm install_

```bash
npm install
```

- Vamos a crearnos el pod para la lista de empleados.


_./src/pods/employee-list/employee-list.component.tsx_

```tsx
export const EmployeeListComponent: React.FunctionComponent = () => {
  return (
    <h2>Hello from Employee list POD Component</h2>
  )
}
```

_./src/pods/employee-list/employee-list.container.tsx_

```tsx
import {EmployeeListComponent} from './employee-list.component;

export const EmployeeListContainer: React.FunctionComponent = () => {
  return (
    <>
    <h1>Hello from Employee list POD Container</h1>
    <EmployeeListComponent/>
    </>
  )
}
```

- Vamos a crear un barrel:

_./src/pods/employee-list/index.ts_

```typescript
export * from './employee-list.container.tsx'
```


- Lo añadimos a nuestra escena:

_./src/scenes/employee-list.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';
+ import {EmployeeListContainer} from 'pods/employee-list';

export const EmployeeListScene: React.FC = () => {
  return (
    <AppLayout>
-      <h1>Employee list Scene!</h1>
-      <Link to={routes.editEmployee('232')}>Navigate to edit employee 232</Link>
+      <EmployeeListContainer>
    </AppLayout>
  );
};
```

- Ejecutamos y vemos que efectivamente se muestra el pod correcto en employee list:

```bash
npm start
```

- Para mostrar una lista de empleados vamos a necesitar un view model:

_./src/scenes/employee-list.vm.tsx_

```ts
```

- Vamos a crear una API fake, ojo aquí podríamos tomar varios caminos.
En este caso la API recibe model de API y usamos mappers (el contenedor
es responable de mapearlo).

Otra opción sería que la API usara internamente el modelo de API, pero
como parametros de entrada y salida el VM (quedando el mapping dentro de
la API.

Una tercera opción sería crear una API de modelo de API, y una API de Viewmodel
que se alimentara de la primera (usando mappers).

Cada aproximación tiene sus pros y sus cons.

En esta caso vamos a crear una API en memoría con la que podemos simular
operaciones de borrado e inserción.

_./src/pods/employee-list/api/employee-list.api-model.ts_

```ts
```

_./src/pods/employee-list/api/employee-list.mock-data.ts_

```ts
```


_./src/pods/employee-list/api/employee-list.api.ts_

```ts
```

_./src/pods/employee-list/api/index.ts_

```ts
```

- Vamos a hacer la carga de datos en el contenedor:

_./src/pods/employee-list/employee-list.container.tsx_

```diff
```

- Y vamos a pasarlo al componente hijo:

_./src/pods/employee-list/employee-list.container.tsx_

```diff
```

_./src/pods/employee-list/employee-list.component.tsx_

```diff
```

- Ahora vamos a mostrar esos datos en una tabla simple de material ui.

- Hasta aquí bien, pero queremos añadir una sería de cosas:
   - Comandos.
   - Paginación.
   - ...

Además todo esto se va a repetir en varias ventanas, así que hemos
construido un asset de arquitectura:


Veamos como usar esto:




# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
