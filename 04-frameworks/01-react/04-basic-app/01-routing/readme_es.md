# 01 routing

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler_.

Partimos de una base en la que tenemos configurado webpack e
instalado React, mostramos un mensaje de "Hola Mundo".

Hemos hablado acerca de aplicaciones SPA, vamos a ver cómo
utilizar un router en React y crearemos 3 páginas lógicas (todas en blanco,
sólo con un enlace para navegar entre ellas),
navegando entre ellas:

- Una de login.
- Una de listado.
- Una de detalle (esta recibirá un parámetro en la url).

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Para poder implementar una aplicación SPA nos hace falta un router,
  vamos a instalar _react-router_ (la versión 7 ya incluye los typings).

```bash
npm install react-router-dom --save
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
+ import { HashRouter, Routes, Route } from "react-router-dom";
+ import {LoginPage} from './login';
+ import {ListPage} from './list';
+ import {DetailPage} from './detail';


export const App = () => {
-  return <h1>Hello React !!</h1>;
+ return (
+  <HashRouter>
+     <Routes>
+       <Route path="/" element={<LoginPage/>} />
+       <Route path="/list" element={<ListPage/>} />
+       <Route path="/detail" element={<DetailPage/>} />
+     </Routes>
+   </HashRouter>
+ );
};
```

- Vamos a ejecutar y ver qué pasa (podemos ir navegando tecleando en le url del
  navegador, por ejemplo http://localhost:5173/#/list):

```bash
npm start
```

- Navegar tecleando la url está bien pero lo normal es hacerlo clicando en enlaces
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

Vamos a añadir un botón para navega desde login a la página de lista:

_./src/login.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
+ const navigate = useNavigate();

+  const handleNavigation = () => {
+    navigate("/list");
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

Esto es para tener compatibilidad de navegación con navegadores antiguos, lo que hay después
de la almohadilla lo ignoran los navegadores y es tu sitio para definir rutas SPA.

Si quieres cambiarlo puedes usar _BrowserRouter_ en vez de _HashRouter_

_./src/app.tsx_

```diff
import React from "react";
- import { HashRouter, Routes, Route } from "react-router-dom";
+ import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-      <HashRouter>
+      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/list" element={<ListPage/>} />
          <Route path="/detail" element={<DetailPage>} />
        </Routes>
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
+ import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./login";
import { ListPage } from "./list";
import { DetailPage } from "./detail";

export const App = () => {
  return (
-    <BrowserRouter>
+    <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
          <Route path="/list" element={<ListPage/>} />
          <Route path="/detail" element={<DetailPage>} />
        </Routes>
-    </BrowserRouter>
+    </Router>
  );
};
```

Cuando usamos BrowserRouter en una aplicación SPA, la gestión de rutas se hace del lado del cliente.
Sin embargo, el navegador sigue teniendo su comportamiento natural; si refrescas la página en una ruta
distinta de la raíz (por ejemplo /list), el navegador intentará pedir ese recurso directamente al servidor.

- Con Vite: el servidor de desarrollo ya está preparado para SPAs. Por defecto, devuelve siempre el
  index.html para cualquier ruta desconocida. De esta forma, React Router puede encargarse de resolver
  qué vista mostrar sin dar error.

- Con Webpack Dev Server: este comportamiento no viene activado por defecto. Al refrescar en /list,
  el navegador pedirá /list al servidor, pero como ese archivo no existe en el sistema de ficheros,
  obtendrás un 404. Para evitarlo, hay que configurar `historyApiFallback` en webpack.config.js.
  Esto obliga al servidor a redirigir todas las rutas desconocidas al index.html, permitiendo que
  React Router gestione la navegación correctamente.

En producción ocurrirá lo mismo: si tu servidor no redirige todas las rutas al index.html, al refrescar
en una página distinta de la raíz obtendrás un error. La solución es configurar la regla de fallback o
rewrite según el servidor (Nginx, Apache, Netlify, etc.).

**ATENCIÓN: CONFIGURACIÓN PARA WEBPACK**
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
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
