# 01 Routes

Vamos a hacer setup de las rutas de navegación y añadir escenas en blanco para:

- Login
- Panel de opciones principal.
- Listado de empleados
- Edición empleados.

Vamos a montar las rutas de forma que sea fácil de matener a futuro.

# Pasos

- Copiate el ejemplo anterior _00-boilerplate_ y haz un _npm install_

```bash
npm install
```

- Vamos instalarnos _react-router-dom_

```bash
npm install react-router-dom --save
```

- Y sus tipos:

```bash
npm install @types/react-router-dom --save
```

- Vamos a definir las página principales de nuestra aplicación las
  definiremos bajo la carpeta _scenes_.

_./src/scenes/login.scene.tsx_

```tsx
import React from 'react';

export const LoginScene: React.FC = () => {
  return <h1>Hello from Login Scene!</h1>;
};
```

_./src/scenes/submodule-list.scene.tsx_

```tsx
import React from 'react';

export const SubmoduleListScene: React.FC = () => {
  return <h1>Submodule list Scene!</h1>;
};
```

_./src/scenes/employee-list.scene.tsx_

```tsx
import React from 'react';

export const EmployeeListScene: React.FC = () => {
  return <h1>Employee list Scene!</h1>;
};
```

_./src/scenes/employee.scene.tsx_

```tsx
import React from 'react';

export const EmployeeScene: React.FC = () => {
  return <h1>Employee Scene!</h1>;
};
```

- Y para no tener que referenciarlas desde fuera por fichero vamos
  a definir un barrel:

_./src/scenes/index.ts_

```typescript
export * from './login.scene';
export * from './submodule-list.scene';
export * from './employee-list.scene';
export * from './employee.scene';
```

- Para definir las rutas vamos a montar algo que nos permita olvidarnos
  de strings hardcodeados, además de esto tenemos un desafío adicional:
  - Por un lado están las rutas que definimos en el switch de react router:
    - Si no tienen parametros van tal cual.
    - Si tienen parametros las tenemos que definir: _editEmployee: '/employees/:id'_
  - Por otro como consumimos las rutas:
    - Si no tienen parametros van tal cual.
    - Si tienen parametros las llamamos con su parametro _/employees/2345_

Podríamos plantearnos hacer dos listas con las constantes de cada ruta,
pero estaríamos harcodeando dos veces los strings y sería fácil equivocarnos
cuando estuvieramos añadiendo nuevos miembros o modificando.

Ya que tenemos Typescript a mano, podemos plantear:

- Tener un interfaz en el que enumeremos que rutas vamos a tener
  disponibles.
- Tener un objeto que define la de rutas para el SwitchRouter, que hereda del interfaz de rutas.
- Definimos un interfaz que herede de las rutas base que definimos antes,
  pero sobreescribimo las que son de tipo parametro (pasan a ser de tipo función).
- Tenemos un objeto para las rutas de navegación.

Implementandolo lo vamos a entender mejor:

Primero definimos las rutas para el switch y el objeto que las define.

_./src/core/router/routes.ts_

```tsx
import { generatePath } from 'react-router-dom';

interface SwitchRoutes {
  root: string;
  login: string;
  submoduleList: string;
  employees: string;
  editEmployee: string;
}

export const switchRoutes: SwitchRoutes = {
  root: '/',
  login: '/login',
  submoduleList: '/submodule-list',
  employees: '/employees',
  editEmployee: '/employees/:id',
};
```

Vamos ahora a definir las rutas de navegación:

(añadir al final del fichero)

_./src/core/router/routes.ts_

```tsx
interface Routes extends Omit<SwitchRoutes, 'editEmployee'> {
  editEmployee: (id: string) => string;
}
```

Fijate que curioso, reaprovechamos todas las rutas, menos la que
trabajar con parametros, en este caso vamos un paso más alla y creamos
una entrada de tipo función para que sea más fácil generar la ruta.

¿Que hacemos ahora para definir la ruta de navegación? Aplicamos
el spread operator, copiamos todos los valores de switchrouter y
después sobreescribimos las que son rutas de tipo funcíon.

_./src/core/router/routes.ts_

```tsx
export const routes: Routes = {
  ...switchRoutes,
  editEmployee: id => generatePath(switchRoutes.editEmployee, { id }),
};
```

> Aquí hay algo que nos puede "chirriar" y es que estamos exportando
> "SwitchRoutes" y "Routes", ¿No deberías de llamarlo "NavigationRoutes"?
> El caso es que el router de nuestra aplicación lo vamos a encapsular
> dentro de esta misma carpeta y sólo vamos a exponer hacia fuera las
> rutas de navegación, empezamos por definir el router, vamos a traernos
> algunos imports:

_./src/core/router/router.component.tsx_

```tsx
import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import {
  LoginScene,
  SubmoduleListScene,
  EmployeeListScene,
  EmployeeScene,
} from '../../scenes';
```

De estos imports hay uno que chirría un poco el _../../scenes_, esto no pinta bien que demos hacer? Tanto typescript como webpack nos permiten definir alias, vamos a definir un alias para esta carpeta raíz:

Aquí podemos darle más vueltas de tuerca:

- Por un lado webpack puede leer la lista de alias del tsconfig, ahorrandote
  repetirlo en dos sitios.
- Por otro lado le puedes decir que coja los nombres de las carpetas, así
  no te tienes que preocupar tu de ir tecleandolos (aquí te puedes encontrar
  algún problema a futuro si tienes algún nombre de carpeta que necesita un alias).

Vamos a crearnos una alias para la carpeta de escenas ¿Cómo podemos hacer esto?

- Primero en el _tsconfig_ lo añadimos:

_./tsconfig_

```diff
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "allowJs": true,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src/",
+    "paths": {
+      "core": ["core"],
+      "scenes": ["scenes"]
+    }
  },
  "include": ["./src/**/*", "./config/test/setup.ts", "./global.types.d.ts"]
}
```

> Importante fijate aquí que esta configurado el parametro _baseUrl_ para
> que apunte a la carpeta source, y en _include_ le indicamos que tenga
> en cuenta lo que hay dentro de la carpeta _src_, lo que hay dentro de la
> carpeta de configuración de testing (_setup.ts_) y declaraciones que
> queremos que se apliquen a nivel global con _global.types.d.ts_ (por ejemplo para poder hacer un import de un _png_ sin tener que usar _require_).

- Ahora toca actualizar el webpack.config

_./config/webpack/base.js_

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const helpers = require('./helpers');

module.exports = merge(
  {},
  {
    context: helpers.resolveFromRootPath('src'),
    resolve: {
+      alias: {
+        core: helpers.resolveFromRootPath('src/core'),
+        scenes: helpers.resolveFromRootPath('src/scenes'),
+      },
      extensions: ['.js', '.ts', '.tsx'],
    },

```

- Ahora si que podemos referenciar directamente a _scenes_

_./src/core/router/router.component.tsx_

```diff
import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import {
  LoginScene,
  SubmoduleListScene,
  EmployeeListScene,
  EmployeeScene,
- } from '../scenes';
+ } from 'scenes';
```

- Y podemos definir nuestro _RouterComponent_

**añadir al final del fichero**

_./src/core/router/router.component.tsx_

```tsx
export const RouterComponent: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path={[switchRoutes.root, switchRoutes.login]}
          component={LoginScene}
        />
        <Route
          exact={true}
          path={switchRoutes.submoduleList}
          component={SubmoduleListScene}
        />
        <Route
          exact={true}
          path={switchRoutes.employees}
          component={EmployeeListScene}
        />
        <Route
          exact={true}
          path={switchRoutes.editEmployee}
          component={EmployeeScene}
        />
      </Switch>
    </Router>
  );
};
```

- Ahora vamos a decidir que exponemos hacía fuera y que dejamos dentro del core
  (al menos si el desarrollador accede desde el barrel):

_./src/core/index.ts_

```ts
export * from './router.component';
export { routes } from './routes';
```

En este caso dejamos las _switchRoutes_ dentro del barrel ya que sólo las va
a consumir el _router.component_

Vamos ya a usar nuestro _router.component_ en la aplicación:

_./src/app.tsx_

```diff
import React from 'react';
import { hot } from 'react-hot-loader/root';
+ import { RouterComponent } from 'core/router';

const App: React.FunctionComponent = () => {
-  return <h1>Hola Origin</h1>;
+  return <RouterComponent />;
};

```

- Arrancamos para ver que levanta con la página de login:\_

```bash
npm start
```

- Vamos a añadir enlaces de navegación para ver que funciona:

_./src/scenes/login.scene.tsx_

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
+ import { routes } from 'core/router';


export const LoginScene: React.FC = () => {
-  return <h1>Hello from Login Scene!</h1>;
+  return (
+    <>
+      <h1>Hello from Login Scene!</h1>
+      <Link to={routes.submoduleList}>Navigate to submodule list</Link>
+    </>
+  );
};
```

_./src/scenes/submodule-list.scene.tsx_

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
+ import { routes } from 'core/router';

export const SubmoduleListScene: React.FC = () => {
-  return <h1>Submodule list Scene!</h1>;
+  return (
+    <>
+      <h1>Submodule list Scene!</h1>
+      <Link to={routes.employees}>Navigate employee list</Link>
+    </>
+  );
};
```

_./src/scenes/employee-list.scene.tsx_

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
+ import { routes } from 'core/router';

export const EmployeeListScene: React.FC = () => {
-  return <h1>Employee list Scene!</h1>;
+  return (
+    <>
+      <h1>Employee list Scene!</h1>
+      <Link to={routes.editEmployee('232')}>Navigate ti edit employee 232</Link>
+    </>
+  );
};
```

_./src/scenes/employee.scene.tsx_

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
+ import { routes } from 'core/router';

export const EmployeeScene: React.FC = () => {
-  return <h1>Employee Scene!</h1>;
+  return (
+    <>
+      <h1>Employee Scene!</h1>
+      <Link to={routes.employees}>Back to employee list</Link>
+    </>
+  );
};
```

Ya lo tenemos funcionando, si nos fijamos hemos trabajado mucho
para crear un enrutado que yendo a lo rápido y sucio habríamos
tardado minutos ¿Por qué todo este esfuerzo? Para una aplicación
que crezca y se tenga que matener en el tiempo tenemos las
siguientes ventajas:

- Todas las rutas están identificadas en un sólo sitio.
- En un sólo sitio están agrupadas las constantes.
- El desarrollador que consume estas rutas sólo se tiene que
  preocupar de usar Routes, y al estar tipado cuando sea de tipo
  función le saltará indicandole incluso el tipo de parametro que
  debe de introducir.
- No tenemos un infierno de "../../../"

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
