# Rutas

Hasta ahora hemos creado una aplicación que funciona, pero que difícilmente puede ser mantenida y no sería capaz de escalar.

En los siguientes ejemplos vamos a refactorizar la aplicación, para hacerla más mantenible y permitir que crezca
y escale.

Todo lo que vamos a aplicar aquí puede considerarse una exageración para una aplicación tan pequeña, pero será
nuestro _playground_.

Vamos a empezar a configurar las rutas:

Vamos a refactorizar las rutas de navegación que hemos definido:

# Pasos

- Vamos a copiar el ejemplo anterior (04-basic-app/04-detail)

- Ahora mismo tenemos todos los archivos mezclados a nivel de la carpeta _src_, esto puede llegar a ser bastante desordenado si
  el proyecto sigue creciendo.

- Vamos a hacer una refactorización muy básica y lógica, vamos a crear una carpeta
  llamada _scenes_ para almacenar todas las páginas:

```bash
cd src
```

```bash
mkdir scenes
```

> Consejo: Si esto crece podemos crear subcarpetas agrupando las escenas por categorías

Ahora movamos todas las páginas a esa carpeta de escenas.

Comprobemos que no hemos roto nada :)

```bash
npm start
```

Si echamos un vistazo a _app.tsx_ VS Code ya ha actualizado las rutas a ese
archivo, no está mal :), pero si echamos un vistazo estamos usando rutas relativas para
referenciar a ese archivo, en este caso es algo que no nos daría problemas:

```tsx
import { LoginPage } from "./scenes/login";
import { ListPage } from "./scenes/list";
import { DetailPage } from "./scenes/detail";
```

Pero si estuviéramos importando esta escena desde una subcarpeta empezaríamos a tener el
infierno de los puntos suspendidos, podríamos acabar con importaciones como _../../../escenas/inicio de sesión_, ¿por qué
no crear alias para las carpetas raíz a las que se pueda acceder de forma sencilla?

Podemos definir rutas en _tsconfig_ y alias en _webpack_ uuh espera pero entonces
tenemos que definir cosas similares en dos lugares, vamos a dar una solución que
que evite esto, en primer lugar vamos a definir un alias _@_ en nuestro
_tsconfig.json_:

_tsconfig.json_

```diff
    "esModuleInterop": true,
+    "baseUrl": "src",
+    "paths": {
+      "@/*": ["*"]
+    }
  },
```

Genial, ahora podríamos añadir esta configuración a webpack (ESPERA no lo hagas):

_webpack.config.json_

```diff
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   '@': path.resolve(__dirname, 'src'),
  },
```

Pero como no queremos repetir código, vamos a ver si alguien ha
implementado alguna magia que permita a webpack leer esta configuración desde
el _tsconfig_

Tenemos dos enfoques:

- Código fuente de Gist: https://gist.github.com/nerdyman/2f97b24ab826623bff9202750013f99e

- Plugin de webpack: https://www.npmjs.com/package/tsconfig-paths-webpack-plugin

Vamos a optar por la opción del plugin de webpack:

```bash
npm install tsconfig-paths-webpack-plugin --save-dev
```

Ahora consumamos este plugin:

_./webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require("path");
const basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   plugins: [new TsconfigPathsPlugin()]
  },
```

Ahora podemos actualizar las importaciones para utilizar el nuevo alias _@_.

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "./scenes/login";
- import { ListPage } from "./scenes/list";
- import { DetailPage } from "./scenes/detail";
+ import { LoginPage } from "@/scenes/login";
+ import { ListPage } from "@/scenes/list";
+ import { DetailPage } from "@/scenes/detail";
```

Afinemos un poco, tener que pegar una importación por
página suena un poco repetitivo y por otro lado si
en el futuro decidimos agrupar algunas escenas en algunas subcarpetas
puede repercutir en las declaraciones de importaciones de la _app_, vamos a crear un _barrel_:

_./src/scenes/index.ts_

```ts
export * from "./detail";
export * from "./list";
export * from "./login";
```

Y simplifiquemos nuestro _app.tsx_

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "@/scenes/login";
- import { ListPage } from "@/scenes/list";
- import { DetailPage } from "@/scenes/detail";
+ import {LoginPage, ListPage, DetailPage} from "@/scenes";

export const App = () => {
```

Para definir las rutas vamos a configurar algo que nos permita olvidarnos de las _hardcoded strings_, además de esto tenemos un reto adicional:

- Por un lado están las rutas que definimos en el _switch_ de _router react_:

  - Si no tienen parámetros van tal cual.
  - Si tienen parámetros tenemos que definir: editEmployee: '/empleados/:id'.

- Por otro lado, cómo consumimos las rutas:
  - Si no tienen parámetros van tal cual.
  - Si tienen parámetros las llamamos con su parámetro /empleados/2345.

Podríamos considerar hacer dos listas con las constantes de cada ruta, pero estaríamos codificando las cadenas dos veces y sería fácil cometer errores al añadir nuevos miembros o modificar.

Ya que tenemos Typescript a mano, podemos considerar:

- Tener una interfaz en la que enumeremos qué rutas vamos a tener disponibles.

- Tener un objeto que defina el enrutamiento para el _SwitchRouter_, que herede de la interfaz de enrutamiento.

- Definimos una interfaz que herede de las rutas base que definimos antes, pero sobrescribimos las que son de tipo parámetro (pasan a ser de tipo función).

- Tenemos un objeto para las rutas de navegación.
  Implementarlo nos ayudará a entenderlo mejor:

Primero definimos las rutas para el _switch_ y el objeto que las define.

Como se trata de un _crosscutting asset_ lo colocaremos bajo la ruta _./src/core_.

_./src/core/router/routes.ts_

```tsx
import { generatePath } from "react-router-dom";

interface SwitchRoutes {
  root: string;
  list: string;
  details: string;
}

export const switchRoutes: SwitchRoutes = {
  root: "/",
  list: "/list",
  details: "/detail/:id",
};
```

Definamos las rutas de navegación: todas las rutas son iguales menos la ruta _detalles_.
(definición del parámetro vs parámetro real al navegar):

Añadamos el siguiente contenido:

_./src/core/routers/routes.tsx_

```tsx
interface Routes extends Omit<SwitchRoutes, "details"> {
  details: (id: string) => string;
}
```

¿Qué hacemos aquí? Heredando de la interfaz de Switch y eliminando
las entradas que no son iguales para reescribirlas.

Vamos a implementar ahora el objeto de rutas (append content):

_./src/core/routers/routes.tsx_

```tsx
export const routes: Routes = {
  ...switchRoutes,
  details: (id) => generatePath(switchRoutes.details, { id }),
};
```

- Aquí hay algo que suena raro, y es que estamos exportando "SwitchRoutes" y "Routes", ¿no debería llamarse "NavigationRoutes"? El caso es que vamos a encapsular el _router_ de nuestra aplicación dentro de esta misma carpeta y sólo vamos a exponer fuera las rutas de navegación, empezamos por definir el _router_, vamos a traer algunas importaciones:

_./src/core/router/router.component.tsx_

```tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { switchRoutes } from "./routes";
import { LoginPage, ListPage, DetailPage } from "@/scenes";

export const RouterComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={switchRoutes.root} element={<LoginPage />} />
        <Route path={switchRoutes.list} element={<ListPage />} />
        <Route path={switchRoutes.details} element={<DetailPage />} />
      </Routes>
    </Router>
  );
};
```

- Vamos a crear un _barrel_ debajo de nuestro _barrel_ principal, este caso sólo eliminamos de la exportación
  el _switchRoutes_ ya que sólo se utilizará internamente en el archivo _routes.ts_.

_./src/core/index.ts_

```ts
export * from "./router/router.component";
export { routes } from "./router/routes";
```

Es hora de entrar en _app.tsx_ y reemplazar el _router_:

_./src/app.tsx_

```diff
import React from "react";
- import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage, ListPage, DetailPage } from "@/scenes";
+ import { RouterComponent } from 'core';

export const App = () => {
+    return <RouterComponent />;
-  return (
-    <Router>
-      <Routes>
-        <Route path="/" element={<LoginPage />} />
-        <Route path="/list" element={<ListPage />} />
-        <Route path="/detail/:id" element={<DetailPage />} />
-      </Routes>
-    </Router>
-  );
};
```

- Ahora es el momento de deshacerse de todos los enlaces codificados que hay en la aplicación:

_./src/scenes/login.tsx_

```diff
+ import {routes} from 'core';
// (...)

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
-      navigate("/list");
+      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```

_./src/scenes/list.tsx_

```diff
+ import {routes} from 'core';
// (...)

        {members.map((member) => (
          <>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
-            <Link to={`/detail/${member.login}`}>{member.login}</Link>
+            <Link to={routes.details(member.login)}>{member.login}</Link>
          </>
        ))}
      </div>
-      <Link to="/detail">Navigate to detail page</Link>
    </>
```

_./src/scenes/detail.tsx_

```diff
+ import {routes} from 'core';
// (...)

      <p> bio: {member.bio}</p>
-      <Link to="/list">Back to list page</Link>
+      <Link to={routes.list}>Back to list page</Link>
    </>
```

Genial, así que en el primer intento sólo codificamos la aplicación en minutos, ahora nos ha llevado más tiempo, ¿qué
son los beneficios de esto:

- [Alias] No tenemos el infierno de "../../../".
- Todas las rutas están identificadas en un solo lugar.
- Las constantes se agrupan en un solo lugar.
- El desarrollador que consuma estas rutas sólo tiene que preocuparse de usar Rutas, y al teclear cuando sea un tipo de función aparecerá indicando incluso el tipo de parámetro que debe introducir.
