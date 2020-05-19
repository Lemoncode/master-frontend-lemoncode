# 01 routing

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler_.

Partimos de una base en la que tenemos configurado webpack e
instalado React, mostramos un mensaje de "Hola Mundo".

Hemos hablado acerca de aplicaciones SPA, vamos a ver como
utilizar un router en React y crearemos 3 páginas logicas (todas en blanco,
sólo con un enlace para navegar entre ellas),
navegando entre ellas:

- Una de login.
- Una de listado.
- Una de detalle (esta recibirá un parametro en la url).

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Para poder implementar una aplicación SPA nos hace falta un router,
  vamos a instalar _react-router_

```bash
npm install react-router-dom --save
```

Y sus typings:

```bash
npm install @types/react-router-dom --save
```

- Vamos a crear una página de login en blanco, va a ser un componente de React.

_./src/login.tsx_

```tsx
import React from "react";

export const LoginPage: React.FC = () => {
  return (
    <>
      <h2>Hello from login page</h2>
    </>
  );
};
```

- Otra de listado:

_./src/list.tsx_

```tsx
import React from "react";

export const ListPage: React.FC = () => {
  return (
    <>
      <h2>Hello from List page</h2>
    </>
  );
};
```

- Otra de detalle:

_./src/detail.tsx_

```tsx
import React from "react";

export const DetailPage: React.FC = () => {
  return (
    <>
      <h2>Hello from Detail page</h2>
    </>
  );
};
```

- Ahora vamos a definir el enrutado en nuestro fichero _app.tsx_:

_./src/app.tsx_

```diff
import React from "react";
+ import { HashRouter, Switch, Route } from "react-router-dom";
+ import {LoginPage} from './login';
+ import {ListPage} from './list';
+ import {DetailPage} from './detail';


export const App = () => {
-  return <h1>Hello React !!</h1>;
+ return (
+  <HashRouter>
+     <Switch>
+       <Route path="/">
+          <LoginPage/>
+       </Route>
+       <Route path="/list">
+          <ListPage/>
+       </Route>
+       <Route path="/detail">
+          <DetailPage/>
+       </Route>
+     </Switch>
+  </HashRouter>
+ );
};
```

- Vamos a ejecutar y ver que pasa:

```bash
npm start
```

- si arrancamos la aplicación vemos que _loginPage_ se muetras, si intentamos
  navegar a _list_ (tecleando la url del navegador) podemos ver como nos vuelve a
  llevar a la página de login ¿Por qué? Resulta que la ruta raíz es muy "glotona"
  y se traga todas las url, para ellos tenemos que decirle que sólo escuche
  exactamente a esa ruta "/" sólo eso.

```diff
        <Switch>
-          <Route path="/">
+          <Route exact path="/">

            <LoginPage />
          </Route>
```

- Ahora si, ya podemos entrar la url de _list_ o _detail_ y navegamos.

- Navegar tecleando la url está bien pero lo normal es hacerlo clickando en enlaces
  o botones, vamos a ello.

Vamos a añadir unos enlaces en cada página:

_./src/login.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const LoginPage: React.FC = () => {
  return (
    <>
      <h2>Hello from login page</h2>
+     <Link to="/list">Navigate to list page</Link>
    </>
  );
};
```

- Otra de listado:

_./src/list.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const ListPage: React.FC = () => {
  return (
    <>
      <h2>Hello from List page</h2>
+      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
};
```

- Otra de detalle:

_./src/detail.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";

export const DetailPage: React.FC = () => {
  return (
    <>
      <h2>Hello from Detail page</h2>
+     <Link to="/list">Back to list page</Link>
    </>
  );
};
```

Genial... pero y si ahora quiero navegar desde JavaScript (por ejemplo la pulsar en un botón),
tengo que usar un hook que me ofrecer React Router DOM:

Vamos a añadir un bottón para navega desde login a la página de lista:

_./src/_

```diff
import React from "react";
import { Link } from "react-router-dom";
+ import { Link, useHistory } from "react-router-dom";

export const LoginPage: React.FC = () => {
+ const history = useHistory();

+  const handleNavigation = () => {
+    history.push("/list");
+  };

  return (
    <>
      <h2>Hello from login page</h2>
-      <Link to="/list">Navigate to list page</Link>
+      <button onClick={handleNavigation}>Login</button>
    </>
  );
};
```

- Esto pinta bien, pero en la url sale una almohadilla

```
http://localhost:8080/#/list
```

Esto es para tener compatibilida de navegación con navegadores antiguos, lo que hay después
de la almohadilla lo ignoran los navegadores y es tu sitio para definir rutas SPA.

Si quieres cambiarlo puedes usar _BrowserRouter_ en vez de _HashRouter_

_./src/app.tsx_

```diff
import React from "react";
- import { HashRouter, Switch, Route } from "react-router-dom";
+ import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-      <HashRouter>
+      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route path="/list">
            <ListPage />
          </Route>
          <Route path="/detail">
            <DetailPage />
          </Route>
        </Switch>
-      </HashRouter>
+      </BrowserRouter>
  );
};
```

- Lo más cómodo es usar un alias para leer mejor el jsx:

_./src/app.tsx_

```diff
import React from "react";
- import { BrowserRouter, Switch, Route } from "react-router-dom";
+ import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-    <BrowserRouter>
+    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route path="/list">
          <ListPage />
        </Route>
        <Route path="/detail">
          <DetailPage />
        </Route>
      </Switch>
-    </BrowserRouter>
+    </Router>
  );
};
```

- Hay una pega con todo esto y es que si te vas por ejemplo a la página de listado y pulsas en refresh (F5)
  te da un error, ¿ Qué es lo que pasa aquí? Que va a servidor a intentar cargar esa ruta, y en el servidor
  no existe... tenemos que definir un redirect en el servidor web para que sirva la página raiz.

Si lo quieres arreglar en _webpack.config_ para desarrollar en local:

_./webpack.config.js_

```diff
  stats: "errors-only",
  output: {
    filename: "[name].[chunkhash].js",
+    publicPath: "/",
  },
+  devServer: {
+    historyApiFallback: true,
+  },
```

Y para arreglarlo en producción: https://tylermcginnis.com/react-router-cannot-get-url-refresh/

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
