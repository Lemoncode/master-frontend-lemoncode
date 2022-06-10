# Layout

Bien... ahora tenemos las páginas y las rutas bajo control, pero... normalmente algunas páginas
tienen la misma estructura en común, por ejemplo una cabecera, un pie de página, y otras no
(por ejemplo, la pantalla de inicio de sesión).

Si te remontas a los días de _ASP .net_ había un concepto llamado _páginas maestras_
donde se definía un diseño, y un marcador de posición para mostrar el contenido de las páginas, nosotros
implementaremos algo muy similar.

# Pasos

Bien, primero de todo, ¿dónde debemos mostar estos _layouts_?
Vamos a crear una carpeta _layouts_ bajo nuestra carpeta _src_.

```bash
cd src
```

```bash
mkdir layouts
```

- En primer lugar vamos a crear un diseño que centrará el contenido, este diseño nos permitirá
  simplificar nuestra página de inicio de sesión:

_./src/layouts/center.layout.tsx_

```tsx
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const CenterLayout: React.FC<Props> = ({ children }) => (
  <div className="layout-center">{children}</div>
);
```

- Vamos a crear el _barrel_ para la subcarpeta de _layouts_:

_./src/layouts/index.ts_

```ts
export * from "./center.layout";
```

- Apliquemos este _layout_ a la página de _login_:

_./src/scenes/login.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
+ import {CenterLayout} from '@/layouts';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return (
-    <div>
+    <CenterLayout>
      <form onSubmit={handleNavigation}>
        <div className="login-container">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">login</button>
        </div>
      </form>
-    </div>
+    </CenterLayout>
  );
};
```

En este caso puede ser un cambio ligero pero, ten en cuenta:

- Separación de preocupaciones, el diseño se define en un lugar separado.
- Podríamos reutilizarlo para otras páginas.
- En el futuro podríamos usar este _widget_ de _login_ en otros lugares (_spoiler alert_, _pods_).

> Usando React Router también puedes integrar layouts.

- Sigamos jugando con los _layouts_, ahora vamos a definir un _layout_ para la app que
  contendrá una cabecera.

_./src/styles.css_

```diff
body {
  font-family: Sans-Serif;
}

+ .layout-center {
+  display: grid;
+  grid-template-columns: 1fr;
+  align-items: center;
+  justify-items: center;
+  margin-top: 2rem;
+ }

+ .layout-app-container {
+  display: grid;
+  grid-template-columns: 1fr;
+  grid-template-rows: 50px 1fr;
+ }
+
+.layout-app-header {
+  color: white;
+  background-color: #007661;
+  display: flex;
+  align-items: center;
+  justify-content: flex-end;
+  padding-right: 5px;
+}
```

_./src/layouts/app.layout.tsx_

```tsx
import React from "react";

// New on React 18
interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => (
  <div className="layout-app-container">
    <div className="layout-app-header">User Logged in</div>
    {children}
  </div>
);
```

- Vamos a añadir el _barrel_ a _layout_.

_./src/layouts/index.ts_

```diff
export * from "./center.layout";
+ export * from './app.layout';
```

- Actualicemos la _list page_:

_./src/scenes/list.tsx_

```diff
+ import {AppLayout} from '@/layouts';
// (...)

  return (
-    <>
+    <AppLayout>
      <h2>Hello from List page</h2>
      <div className="list-user-list-container">
        <span className="list-header">Avatar</span>
        <span className="list-header">Id</span>
        <span className="list-header">Name</span>
        {members.map((member) => (
          <>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <Link to={routes.details(member.login)}>{member.login}</Link>
          </>
        ))}
      </div>
      <Link to="/detail">Navigate to detail page</Link>
+    </AppLayout>
-    </>
  );
```

Ahora entremos en detalles, detente un segundo e intenta añadir
el diseño en esas páginas por ti mismo.

_./src/scenes/detail.tsx_

```diff
+ import {AppLayout} from '@/layouts';
// (...)

  return (
-    <>
+    <AppLayout>
       <h2>Hello from Detail page</h2>
       <p> id: {member.id}</p>
       <p> login: {member.login}</p>
       <p> name: {member.name}</p>
       <p> company: {member.company}</p>
       <p> bio: {member.bio}</p>
       <Link to={routes.list}>Back to list page</Link>
-    </>
+    </AppLayout>
  );
```

Vamos a probarlo

```bash
npm start
```
