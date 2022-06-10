# Datos transversales(Cross cutting data)

En react estamos acostumbrados a pasar datos de padre a hijo (enfoque prop drill),
pero hay entradas a las que necesitamos acceder desde cualquier lugar, como la información del usuario, o la información del tema, para manejar esto React nos ofrece el contexto.
Veamos como podemos usar esto y encajarlo en nuestra arquitectura.

En este ejemplo obtendremos el nombre de usuario registrado y lo almacenaremos en un lugar global, luego lo consumiremos en el cabecera del layout.

# Pasos

- En primer lugar tenemos que decidir, esta funcionalidad podría caer en tres áreas:
  - _common_: podríamos pensar que almacenar el nombre de usuario podría ser reutilizado en otras aplicaciones, no es un mal lugar para almacenarlo,
    aunque normalmente cada aplicación en el mundo real almacenaría información diferente.
  - _common-app_: podemos pensar que es un _asset_ que va a ser reutilizado en varios lugares de la aplicación,
    pero, ¿se va a reutilizar o sólo se va a invocar en varios sitios?
  - _core_: ¿Podemos considerar que se trata de un activo transversal?

No hay una respuesta clara :), ¿cuál es tu opinión al respecto?

En este ejemplo hemos optado por _core_, razones:

- Cada aplicación almacena diferente información de perfil de usuario (nombre, login, rol, duración de la sesión...), no es tan sencillo
  crear algo universal y fuertemente tipado, podríamos intentar usar genéricos, etc., pero podría complicar las cosas.
- Este activo es similar a las definiciones de las rutas, no vamos a un componente como una barra de filtro y soltarlo en algunas páginas,
  simplemente vamos a hacer uso de esta característica de corte transversal (raíz instanciar el proveedor, la tienda de inicio de sesión en el contexto, la cabecera de leer desde el contexto).

- Empecemos a implementar esto, primero definamos el contexto:

- Primero definamos la estructura de datos del perfil...

_./src/core/profile/profile.vm.ts_

```tsx
export interface UserProfile {
  userName: string;
}

export const createEmptyUserProfile = (): UserProfile => ({
  userName: "",
});
```

- Ahora vamos a definir el contexto y el _provider_:

_./src/core/profile/profile.context.tsx_

```tsx
import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";

interface Context extends UserProfile {
  setUserProfile: (userProfile: UserProfile) => void;
}

const noUserLogin = "no user login";

export const ProfileContext = React.createContext<Context>({
  userName: noUserLogin,
  setUserProfile: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});

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

- Y definamos un _barrel_ esta vez directamente bajo el perfil de usuario, también podríamos añadirlo al _barrel_ principal,
  **pequeña discusión** vamos a crear ambos y discutir si es un buen enfoque o no.

_./src/core/profile/index.ts_

```ts
export * from "./profile.context";
```

- Ahora es el momento de colocar este _context provider_ en la parte superior de nuestra aplicación (es algo que se consume a nivel global).

_./src/app.tsx_

```diff
import React from "react";
import { RouterComponent } from "@/core";
+ import { ProfileProvider } from '@/core/profile';


export const App = () => {
-  return <RouterComponent />;
+  return (<ProfileProvider>
+           <RouterComponent />
+          </ProfileProvider>);
};
```

Y en el componente de _login_ vamos a almacenar el nombre de usuario en el contexto...

_./src/scenes/login.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { CenterLayout } from "@/layouts";
+ import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
+  const { setUserProfile } = React.useContext(ProfileContext);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
+     setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```

- Ahora vamos a mostrar esa información en la _app bar_:

_./src/layouts/app.layout.tsx_

```diff
import React from "react";
+ import { ProfileContext } from "@/core/profile";

-export const AppLayout: React.FC<Props> = ({ children }) => (
+ export const AppLayout: React.FC<Props> = ({ children }) => {
+  const { userName } = React.useContext(ProfileContext);
+  return (
  <div className="layout-app-container">
-    <div className="layout-app-header">User Logged in</div>
+    <div className="layout-app-header">{userName}</div>
    {children}
  </div>
);
+ }
```

- Vamos a intentarlo :)

```diff
npm start
```

Ahora si nos logamos, podemos ver cuando pasamos a la página de listado que
tenemos el nombre de usuario en la barra de la aplicación.
