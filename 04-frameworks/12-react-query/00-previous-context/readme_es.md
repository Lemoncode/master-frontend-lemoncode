# Contexto - Refactor

## Resumen

Que vamos a implementar:

- En el contexto de *login* vamos a hacer una separación de lo que es el contexto del *provider*.
- Vamos a implementar un *helper* para traernos el contexto, y vamos a dejar interno el contexto en sí.
- Vamos a llevarnos la lista de usuarios de *github* a un contexto y veremos cómo podemos navegar y mostrar datos.

## Pasos

- Lo primero separamos contexto de proveedor:

_./src/core/providers/profile/profile.context.ts_

_Renombramos a ts_

```diff
import React from "react";
- import { UserProfile, createEmptyUserProfile } from "./profile.vm";
+ import { UserProfile } from "./profile.vm";

export interface ProfileContextVm extends UserProfile {
  setUserProfile: (userProfile: UserProfile) => void;
}

const noUserLogin = "no user login";

export const ProfileContext = React.createContext<ProfileContextVm>({
  userName: noUserLogin,
  setUserProfile: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});

-interface Props {
-  children: React.ReactNode;
- }
-
- export const ProfileProvider: React.FC<Props> = ({ children }) => {
-  const [userProfile, setUserProfile] = React.useState<UserProfile>(
-    createEmptyUserProfile()
-  );
-
-  return (
-    <ProfileContext.Provider
-      value={{
-        userName: userProfile.userName,
-        setUserProfile,
-      }}
-    >
-      {children}
-    </ProfileContext.Provider>
-  );
- };
```

- Vamos a llevar el contenido al *provider*:

_./src/core/providers/profile/profile.provider.tsx_

```tsx
import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";
import { ProfileContext } from "./profile.context";

interface Props {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>(
    createEmptyUserProfile()
  );

  return (
    <ProfileContext.Provider
      value={{
        userName: userProfile.userName,
        setUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
```

- Esta separación hace que sea más clara la separación entre contexto y proveedor.

- Además de esto nos podemos hacer un *helper* para no tener que usar _useContext_ a
  secas y controlar errores.

_./src/core/providers/profile/profile.provider.tsx_

```diff
    </ProfileContext.Provider>
  );
};

+ export const useProfileContext = () => {
+  const context = React.useContext<ProfileContextVm>(ProfileContext);
+  if(!context) {
+    throw new Error('useProfileContext must be used within a ProfileProvider');
+  }
+  return context;
+ };
```

Importamos _ProfileContextVm_ desde el contexto.

_./src/core/providers/profile/profile.provider.tsx_

```diff
import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";
- import { ProfileContext } from "./profile.context";
+ import { ProfileContext, ProfileContextVm } from "./profile.context";
```

Ahora en el *index* sólo tenemos que exponer la parte del *provider*:

_./src/core/providers/profile/index.ts_

```diff
- export * from "./profile.context";
- export * from "./profile.vm";
+ export * from './profile.provider';
```

- Vamos a utilizar el nuevo *helper* en _loginContainer_ y _appLayout_

_./src/pods/login/login.container.tsx_

```diff
import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "core";
- import { ProfileContext } from "@/core/providers";
+ import { useProfileContext } from "@/core/providers";
import { LoginComponent } from "./login.component";
import { doLogin } from "./login.api";

const useLoginHook = () => {
  const navigate = useNavigate();
-  const { setUserProfile } = React.useContext(ProfileContext);
+  const { setUserProfile } = useProfileContext();
```

_./src/layouts/appLayout.component.tsx_

```diff
import React from "react";
- import { ProfileContextVm } from "@/core/providers";
+ import { useProfileContext } from "@/core/providers";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
-  const { userName } = React.useContext(ProfileContext);
+  const { userName } = useProfileContext();

  return (
    <div className="layout-app-container">
      <div className="layout-app-header">{userName}</div>
      {children}
    </div>
  );
};
```

- Así tenemos una clara separación entre contexto y *provider* y por otro lado, con la función
  *helper* podemos controlar errores, y simplificar el uso del *context*.

- Ahora vamos a llevar la lista de usuarios de *github* a un contexto, ¿Por qué? Porque queremos
  mejorar la usabilidad de nuestra página:
  - Si navegamos a otra página, cuando volvemos queremos mostrar datos.
  - Mientras en *background* la consulta se vuelve a ejecutar.
  
- Para ver qué problema resolvemos vamos a meterle un retraso de 3 segundos a la *api* que nos pide
  datos de *github*.

_./src/pods/list/list.api.ts_

```diff
import { MemberEntityApi } from "./list.api-model";

- export const getMemberCollection = (): Promise<MemberEntityApi[]> =>
-  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
-    response.json()
-  );

+ export const getMemberCollection = (): Promise<MemberEntityApi[]> => {
+  const promise = new Promise<MemberEntityApi[]>((resolve) => {
+    setTimeout(() => {
+      fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
+        resolve(response.json()));
+    }, 3000);
+  });
+
+  return promise;
+ }
```

- En este caso podríamos plantear si poner el *context* y *provider* dentro de *core* o dentro del *pod* en
  el que se usa, en este caso lo vamos a poner dentro del *pod* ya que sólo lo usaremos allí, si más
  adelante lo usáramos en más de una ventana podríamos plantear moverlo a *core*(a nivel de *imports*
  es más correcto tenerlo allí, a nivel de código es más correcto tenerlo en el *pod*).

_./src/pods/list/list.context.ts_

```ts
import React from "react";
import { MemberEntity } from "./list.vm";

export interface MemberListContextVm {
  memberList: MemberEntity[];
  loadMemberList: () => void;
}

export const MemberListContext = React.createContext<MemberListContextVm>({
  memberList: [],
  loadMemberList: () => {
    console.log(
      "If you are reading this, likely you forgot to wrap your component with the MemberListContext.Provider"
    );
  },
});
```

_./src/pods/list/list.provider.tsx_

```ts
import React from "react";
import { MemberEntity } from "./list.vm";
import { MemberListContext, MemberListContextVm } from "./list.context";
import { getMemberCollection } from "./list.repository";

interface Props {
  children: React.ReactNode;
}

export const MemberListProvider: React.FC<Props> = ({ children }) => {
  const [memberList, setMemberList] = React.useState<MemberEntity[]>([]);

  const loadMemberList = () =>
    getMemberCollection().then((memberCollection) =>
      setMemberList(memberCollection)
    );

  return (
    <MemberListContext.Provider
      value={{
        memberList,
        loadMemberList,
      }}
    >
      {children}
    </MemberListContext.Provider>
  );
};

export const useMemberListContext = () => {
  const context = React.useContext<MemberListContextVm>(MemberListContext);
  if (!context) {
    throw new Error("MemberListContext must be used within a ProfileProvider");
  }
  return context;
};
```

Vamos a exponer el *provider* en el *index*:

_./src/pods/list/index.ts_

```diff
export * from "./list.container";
+ export * from "./list.provider";
```

Vamos a definirlo por encima del *router*:

_./src/app.tsx_

```diff
import React from "react";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";
+ import { MemberListProvider } from "@/pods/list";

export const App = () => {
  return (
    <ProfileProvider>
+     <MemberListProvider>
        <RouterComponent />
+      </MemberListProvider>
    </ProfileProvider>
  );
};
```

Y ahora darle uso en _list.container.tsx_:

_./src/pods/list/list.container.tsx_

```diff
import React from "react";
import { ListComponent } from "./list.component";
- import { MemberEntity } from "./list.vm";
- import { getMemberCollection } from "./list.repository";
+ import { useMemberListContext } from "./list.provider";

export const ListContainer: React.FC = () => {
-  const [members, setMembers] = React.useState<MemberEntity[]>([]);
+  const {memberList, loadMemberList} = useMemberListContext();


  React.useEffect(() => {
-    getMemberCollection().then((memberCollection) =>
-      setMembers(memberCollection)
-    );
+    loadMemberList();
  }, []);

-  return <ListComponent members={members} />;
+  return <ListComponent members={memberList} />;

};

```

Si ahora ejecutamos,

```bash
npm start
```

y nos logamos,

```ts
Username: admin;
Password: test;
```

Podemos ver que la segunda vez que navegamos a la página, mostramos la lista que se cargó anteriormente mientras se carga la nueva, ofreciendo una mejor experiencia de usuario.

Nos puede surgir una duda aquí y es ¿Y qué hacemos con la primera carga? Sería buena idea mostrar un indicador de que la página está cargando.

Ahora seguro que se nos ha quedado una espinita clavada y eso ¿Cómo reporto al usuario de que estoy cargando datos y tiene que esperar un poco? Aquí podemos ver de jugar con *flags*, con *react suspense*... pero si podemos lanzar las consultas desde cualquier parte de la aplicación es algo que se nos puede terminar haciendo cuesta arriba, una microlibrería que nos puede ser de ayuda es *React Promise Tracker*:

Vamos a instalar la librería:

```bash
npm install react-promise-tracker --save
```

Vamos a crear un componente que nos muestre el indicador de carga:

_./src/common/components/loading-indicator.tsx_

```tsx
import React from "react";

export const LoadingIndicator = () => {
  return <h1>Hey some async call in progress ! </h1>;
};
```

Vamos a mostrarlo / ocultarlo si hay una llamada asíncrona bloqueante en marcha:

_./src/common/components/loading-indicator.tsx_

```diff
import React from "react";
+ import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = (props) => {
+  const {promiseInProgress} = usePromiseTracker();

-  return <h1>Hey some async call in progress ! </h1>;
+   return promiseInProgress &&
+    <h1>Hey some async call in progress ! </h1>
};
```

> Una opción más mantenible sería separar esto del loading indicator para poder aprovecharlo en otros proyectos.

Añadimos un *barrel* bajo *components*

_./src/common/components/index.ts_

```ts
export * from "./loading-indicator";
```

Vamos a añadir el componente en el _app.tsx_:

_./src/app.tsx_

```diff
import React from "react";
import { RouterComponent } from "@/core";
import { ProfileProvider } from "@/core/providers";
import { MemberListProvider } from "@/pods/list";
+ import { LoadingIndicator } from "@/common/components";

export const App = () => {
  return (
    <ProfileProvider>
      <MemberListProvider>
        <RouterComponent />
+       <LoadingIndicator/>
      </MemberListProvider>
    </ProfileProvider>
  );
};
```

Ahora vamos al contexto donde lanzamos la llamada asíncrona, en este caso sólo queremos mostrar
el *spinner* si es la primera vez que hacemos la petición.

_./src/pods/list/list.provider.tsx_

```diff
import React from "react";
+ import { trackPromise } from 'react-promise-tracker';
import { MemberEntity } from "./list.vm";
import { MemberListContext, MemberListContextVm } from "./list.context";
import { getMemberCollection } from "./list.repository";

interface Props {
  children: React.ReactNode;
}

export const MemberListProvider: React.FC<Props> = ({ children }) => {
  const [memberList, setMemberList] = React.useState<MemberEntity[]>([]);

-  const loadMemberList = () =>
+  const loadMemberList = () => {
-    getMemberCollection().then((memberCollection) =>
+    const promise = getMemberCollection().then((memberCollection) => {

      setMemberList(memberCollection)
-    );
+    });
+   if(memberList.length === 0) {
+     trackPromise(promise);
+   }
+ };
```

Vamos a darle un poco de estilo al componente de indicador de carga en progreso.

Para ello nos vamos a instalar _react-loader-spinner_:

```bash
npm install react-loader-spinner --save
```

Vamos a importar ese _loader_ en nuestro componente de _loading-indicator.tsx_:

_./src/common/components/loading-indicator.tsx_

```diff
import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
+ import { ThreeDots } from "react-loader-spinner";

export const LoadingIndicator = (props) => {
```

Y vamos a darle uso (añadimos un estilado temporal en un proyecto real, extraeríamos a un fichero *css* el estilado):

_./src/common/components/loading-indicator.tsx_

```diff
export const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress &&
-    <h1>Hey some async call in progress ! </h1>;
+    <div
+      style={{
+        width: "100%",
+        height: "100",
+        display: "flex",
+        justifyContent: "center",
+        alignItems: "center"
+      }}
+    >
+      <ThreeDots color="#2BAD60" height="100" width="100" />
+    </div>
};
```

> En una app real miraríamos que esta capa estuviera siempre por encima etc...

- Vamos a probarlo

```bash
npm start
```

*React Promise Tracker* se encarga de llevar un contador interno con todas las promesas que se hayan lanzado.

Extras que tienes con esta librería:

- Puedes definir el *tracker* por áreas de tu *UI*.
- Puedes añadir un *delay* para que se muestra el indicador de carga, así en conexiones rápidas
  evitas parpadeos innecesarios.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.