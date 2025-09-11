# 03 List

## Resumen

Este ejemplo toma como punto de partida el ejemplo _02-login_.

Vamos a implementar una página de listado y enlazarla con una de detalle.

Es decir mostraremos una lista de miembros que pertenecen a una organización
de Github y cuando pinchemos en el nombre de un usuario navegaremos a la
página de detalle pasando en la URL el id del miembro seleccionado.

En este ejemplo haremos una implementación directa del listado, si
quieres ver una paso a paso puede consultar otro ejemplo previo que tenemos
en el que se muestra como crear una lista de usuarios paso a paso.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Si queremos ver qué tipo de datos vamos a manejar, podemos abrir el navegador web y ver que devuelve la API Rest de Github.

```bash
https://api.github.com/orgs/lemoncode/members
```

- Vamos a crearnos un interfaz para tener tipada nuestra interfaz,
  y el modificar el componente que mostrará este listado.

_./src/list.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";

+ interface MemberEntity {
+   id : string;
+   login: string;
+   avatar_url: string;
+ }

export const ListPage: React.FC = () => {
+  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  return (
    <>
      <h2>Hello from List page</h2>
      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
};
```

- Vamos ahora a hacer la carga de datos:

_./src/list.tsx_

```diff
export const ListPage: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity>([]);

+  React.useEffect(() => {
+    fetch(`https://api.github.com/orgs/lemoncode/members`)
+      .then((response) => response.json())
+      .then((json) => setMembers(json));
+  }, []);

  return (
```

- Vamos a comprobar que efectivamente se están cargando los datos:

_./src/list.tsx_

```diff
  return (
    <>
      <h2>Hello from List page</h2>
+    {members.map((member) =>
+       <span key={member.id}>{member.login}</span>
+    )}
-      <Link to="/detail">Navigate to detail page</Link>
    </>
  );
```

- Y ahora vamos a añadir una tabla con grid que muestre los datos:

_./src/styles.css_

```diff
+ .list-user-list-container {
+  display: grid;
+  grid-template-columns: 80px 1fr 3fr;
+  grid-template-rows: 20px;
+  grid-auto-rows: 80px;
+  grid-gap: 10px 5px;
+}
+
+.list-header {
+  background-color: #2f4858;
+  color: white;
+  font-weight: bold;
+}
+
+.list-user-list-container > img {
+  width: 80px;
+}
```

Importamos los estilos en _./src/index.tsx_

```diff
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
+   import "./styles.css";

const container = document.getElementById("root");
```

_./src/list.tsx_

```diff
  return (
    <>
-      <h2>Hello from List page</h2>
-      {members.map((member) => (
-        <span key={member.id}>{member.login}</span>
-      ))}
+      <div className="list-user-list-container">
+        <span className="list-header">Avatar</span>
+        <span className="list-header">Id</span>
+        <span className="list-header">Name</span>
+        {members.map((member) => (
+          <React.Fragment key={member.id}>
+            <img src={member.avatar_url} />
+            <span>{member.id}</span>
+            <span>{member.login}</span>
+          </React.Fragment>
+        ))}
+      </div>
    </>
  );
```

- Hasta aquí bien, pero yo quiero que cuando el usuario pinche en el nombre de un
  miembro navega a la página de detalle de la aplicación para mostrar la ficha, de
  primeras podríamos pensar en construir algo así como:

```diff
  <td>
-    <span>{member.login}</span>
+    <Link to={`/detail/${member.login}`}>{member.login}</Link>
  </td>
```

- Otra forma de crear la url es usando _generatePath_, pero ojo en la versión 5
  esto si hacía el encoding de los parámetros, en la 6 no (https://github.com/remix-run/react-router/issues/7428)

_./src/list.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, generatePath } from "react-router-dom";
```

_./src/list.tsx_

```diff
  <td>
-    <Link to={`/detail/${member.login}`}>{member.login}</Link>
+    <Link to={generatePath('/detail/:id', {id: member.login})}>{member.login}</Link>
  </td>
```

¿En qué impactar que no haga encoding? Si quieres hacer la prueba sustituye el código dentro del useEffect por este;

```tsx
setMembers([{ id: "2", login: "a/b", avatar_url: "" }]);
```

> En la parte de arquitectura aprenderemos a quitar "strings mágicos" de nuestra
> aplicación, ir harcodeando urls por nuestras páginas no es buena idea.

- Muy interesante, ¿Pero cómo puedo leer el id del usuario que estoy
  recibiendo por el parámetro de la URL?

Primero vamos a definir el parámetro en la url de nuestro router

_./src/app.tsx_

```diff
-  <Route path="/detail" element={<DetailPage />} />
+  <Route path="/detail/:id" element={<DetailPage />} />
    <DetailPage />
  </Route>
```

Usando el hook _useParams_.

_./src/detail.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
+ import { Link, useParams } from "react-router-dom";


export const DetailPage: React.FC = () => {
+ const {id} = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
+     <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
