# Pods

Hasta ahora dividir en páginas parece ser una solución justa ya que nuestra aplicación es muy simple, pero imagina un escenario real:

- Si la lógica de nuestra página crece y tenemos que dividirla en diferentes archivos, tendríamos que crear una carpeta por página.
- Una carpeta dada puede tener una funcionalidad rica que podría ser reutilizada en otras páginas, o una página dada podría
  utilizar varias piezas ricas.
- En algunos frameworks de SSR, la página está en una carpeta pública y no queremos ensuciarla con otros archivos (por ejemplo
  lógica de negocio, mapeadores...)
- No es una mala idea separar y asegurarse de que la página sólo maneja cosas relacionadas con la página, elegir el diseño,
  manejar los parámetros de navegación...

Siguiendo el enfoque vamos a encapsular la funcionalidad rica en pods, estos pods serán islas de funcionalidad aisladas,
basándonos en nuestra experiencia, el mapeo pod/página suele ser uno a uno, pero hay
casos en los que una página determinada puede consumir más de un pod (por ejemplo, el panel de control), o al revés (por ejemplo, un pod de acceso
que se utiliza en varios lugares en la página de inicio de sesión de la aplicación, en la capa de inicio de sesión del menú, etc...).

# Pasos

- Empecemos a refactorizar esto, empezaremos por crear una carpeta de pods:

```bash
cd src
```

```bash
mkdir pods
```

- En este caso definiremos los siguientes pods:
  - login
  - list
  - detail

```bash
cd pods
```

```bash
mkdir login
```

```bash
mkdir list
```

```bash
mkdir detail
```

Empecemos a migrar el contenido de la página de _login_, normalmente crearemos un componente contenedor de primer nivel
que contendrá el estado y un componente _dumb_ que contendrá el _layout_ (en este caso podríamos discutir
si esto no es necesario y en otros necesitaremos una solución más elaborada por ejemplo crear
Componentes para desglosar los componentes _dumb_ en más niveles, o...):

Vamos a refactorizar el _login_ para aislar lo que es el objetivo del contenedor y las cosas del componente (_low level_
_submit args etc..._)

_./pods/login/login.container.tsx_

```tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { setUserProfile } = React.useContext(ProfileContext);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "test") {
      setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

- Es el momento de definir el contrato para las _props_:

_./pods/login/login.component.tsx_

```tsx
import React from "react";

interface Props {
  onLogin: (username: string, password: string) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
  return <></>;
};
```

Vamos a importar el componente en el contenedor

_./src/login.container.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";
+ import {LoginComponent} from './login.component';
```

- Es hora de profundizar en el componente de _login_

Vamos a definir unos estilos (añadir al final del fichero CSS)

_./src/styles.css_

```css
.login-container {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.login-container > input {
  width: 320px;
}

.login-container > button {
  width: 180px;
  align-self: center;
}
```

_./pods/login/login.component.tsx_

```diff
import React from "react";

interface Props {
  onLogin : (username: string, password: string) => void;
}

export const LoginComponent: React.FC<Props> = (props) => {
+  const { onLogin } = props;
+  const [username, setUsername] = React.useState("");
+  const [password, setPassword] = React.useState("");

+ const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
+    e.preventDefault();
+    onLogin(username, password);
+ }

-  return <></>
+  return (
+      <form onSubmit={handleNavigation}>
+        <div className="login-container">
+          <input
+            placeholder="Username"
+            value={username}
+            onChange={(e) => setUsername(e.target.value)}
+          />
+          <input
+            placeholder="Password"
+            type="password"
+            value={password}
+            onChange={(e) => setPassword(e.target.value)}
+          />
+          <button type="submit">login</button>
+        </div>
+      </form>
+  );
}
```

- Expongamos el contenedor en un _barrel_

_./pods/login/index.ts_

```ts
export * from "./login.container";
```

- Y es el momento de usarlo en nuestra escena:

_./src/scenes/login.tsx_

```diff
import React from "react";
+ import { LoginContainer } from '@/pods/login';
- import { useNavigate } from "react-router-dom";
- import { routes } from "core";
import { CenterLayout } from "@/layouts";
- import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
-  const navigate = useNavigate();
-  const [username, setUsername] = React.useState("");
-  const [password, setPassword] = React.useState("");
-  const { setUserProfile } = React.useContext(ProfileContext);
-
-  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
-    e.preventDefault();
-
-    if (username === "admin" && password === "test") {
-      setUserProfile({ userName: username });
-      navigate(routes.list);
-    } else {
-      alert("User / password not valid, psst... admin / test");
-    }
-  };
-
  return (
    <CenterLayout>
+      <LoginContainer/>
-      <form onSubmit={handleNavigation}>
-        <div className="login-container">
-          <input
-            placeholder="Username"
-            value={username}
-            onChange={(e) => setUsername(e.target.value)}
-          />
-          <input
-            placeholder="Password"
-            type="password"
-            value={password}
-            onChange={(e) => setPassword(e.target.value)}
-          />
-          <button type="submit">login</button>
-        </div>
-      </form>
    </CenterLayout>
  );
};
```

**EJERCICIO**

- Eso estuvo bien, apliquemos lo que hemos aprendido, ... paremos e intentemos importar a pods la página de la lista.

- Primero vamos a crear el pod de la lista

```bash
cd src
```

```bash
mkdir list
```

Crea el contenedor de la lista y el componente, esta vez el contenedor contendrá la lógica para
cargar la lista de usuarios y el componente contendrá la visualización, aquí podríamos discutir también
donde colocar la lógica de navegación, podríamos burbujear al contenedor o simplemente
colocarla en el componente interno.

- Ahora necesitamos un archivo modelo para almacenar la entidad:

_./pods/list/list.vm.ts_

```ts
export interface MemberEntity {
  id: string;
  login: string;
  avatar_url: string;
}
```

_./pods/list/list.container.tsx_

```tsx
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return <ListComponent members={members} />;
};
```

_./pods/list/list.component.tsx_

```tsx
import { routes } from "@/core";
import React from "react";
import { Link } from "react-router-dom";
import { MemberEntity } from "./list.vm";

interface Props {
  members: MemberEntity[];
}

export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
  return (
    <>
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
    </>
  );
};
```

Creemos el _barrel_

_./src/pods/list/index.ts_

```ts
export * from "./list.container";
```

Y vamos a consumirlo en la escena:

_./src/scenes/list.tsx_

```diff
import React from "react";
- import { Link } from "react-router-dom";
- import { routes } from "core";
import { AppLayout } from "@/layouts";
+ import { ListContainer } from '@/pods/list';

- interface MemberEntity {
-  id: string;
-  login: string;
-  avatar_url: string;
- }
-
- export const ListPage: React.FC = () => {
-  const [members, setMembers] = React.useState<MemberEntity[]>([]);
-
-  React.useEffect(() => {
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
-  }, []);
-
  return (
    <AppLayout>
+      <ListContainer/>
-      <h2>Hello from List page</h2>
-      <div className="list-user-list-container">
-        <span className="list-header">Avatar</span>
-        <span className="list-header">Id</span>
-        <span className="list-header">Name</span>
-        {members.map((member) => (
-          <>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <Link to={routes.details(member.login)}>{member.login}</Link>
-          </>
-        ))}
-      </div>
-      <Link to="/detail">Navigate to detail page</Link>
    </AppLayout>
  );
};
```

- Vamos a refactorizar el componente de detalle, podríamos pensar que esto es sólo un _tak_ aburrido, PEROOOO.... hay un buen elemento nuevo
  para dicutir: estamos leyendo parámetros de la cadena de consulta, quien debe tomar la responsabilidad en la lectura de este valor,
  tenemos dos opciones:
  - Dejar que la escena se encargue de esto y pasarlo como un prop al pod.
  - Dejar que el pod se encargue de esto y usar el hook useParams de react router para obtener directamente los datos.

No hay una bala de plata, así que... ** Discusión... ¿cuál crees que sería el mejor enfoque? **
(...)

Hemos elegido la escena para manejar el parámetro _url parsing_ y pasarlo como un prop al _pod_, ¿Por qué?

- Es información relacionada con la página (escena).
- El _pod_ de detalle podría ser más fácil de reutilizar en otras páginas, no está atado a ciertos parámetros de la url.
- El _pod_ de detalle es más simple y tiene un contrato bien identificado (props).

Vamos a por ello :)

- Vamos a crear el _pod_ de detalle:

```bash
cd src
```

```bash
mkdir detail
```

- Tenemos que definir un archivo _viewmodel_ que contendrá _MemberDetailEntity_

_./src/pods/detail/detail.vm.ts_

```ts
export interface MemberDetailEntity {
  id: string;
  login: string;
  name: string;
  company: string;
  bio: string;
}

export const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
  name: "",
  company: "",
  bio: "",
});
```

- Vamos a crear el contenedor de detalles:

_./src/pods/details/detail.container.tsx_

```tsx
import React from "react";
import { MemberDetailEntity, createDefaultMemberDetail } from "./detail.vm";
import { DetailComponent } from "./detail.component";

interface Props {
  id: string;
}

export const DetailContainer: React.FC<Props> = (props) => {
  const { id } = props;
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setMember(json));
  }, []);

  return <DetailComponent member={member} />;
};
```

- Y el componente del detalle:

_./src/pods/details/detail.component.tsx_

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { routes } from "core";
import { MemberDetailEntity } from "./detail.vm";

interface Props {
  member: MemberDetailEntity;
}

export const DetailComponent: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <>
      <h2>Hello from Detail page</h2>
      <p> id: {member.id}</p>
      <p> login: {member.login}</p>
      <p> name: {member.name}</p>
      <p> company: {member.company}</p>
      <p> bio: {member.bio}</p>
      <Link to={routes.list}>Back to list page</Link>
    </>
  );
};
```

- Vamos a exponerlo via _barrel_:

_./src/pods/details/index.ts_

```ts
export * from "./detail.container";
```

- Y vamos a reemplazarlo en la escena.

_./src/scenes/details.tsx_

```diff
import React from "react";
- import { Link, useParams } from "react-router-dom";
+ import { useParams } from "react-router-dom";
- import { routes } from "core";
import { AppLayout } from "@/layouts";
+ import { DetailContainer } from '@/pods/detail';

- interface MemberDetailEntity {
-  id: string;
-  login: string;
-  name: string;
-  company: string;
-  bio: string;
- }
-
-const createDefaultMemberDetail = () => ({
-  id: "",
-  login: "",
-  name: "",
-  company: "",
-  bio: "",
- });

export const DetailPage: React.FC = () => {
-  const [member, setMember] = React.useState<MemberDetailEntity>(
-    createDefaultMemberDetail()
-  );
  const { id } = useParams();

-  React.useEffect(() => {
-    fetch(`https://api.github.com/users/${id}`)
-      .then((response) => response.json())
-      .then((json) => setMember(json));
-  }, []);

  return (
    <AppLayout>
+      <DetailContainer id={ id }/>
-      <h2>Hello from Detail page</h2>
-      <p> id: {member.id}</p>
-      <p> login: {member.login}</p>
-      <p> name: {member.name}</p>
-      <p> company: {member.company}</p>
-      <p> bio: {member.bio}</p>
-      <Link to={routes.list}>Back to list page</Link>
    </AppLayout>
  );
};
```

Vamos a intentarlo:

```bash
npm start
```

Ya lo tenemos todo migrado a PODS ¿Qué te ha parecido?
