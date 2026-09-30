# 02 Cross-cutting — la sesión en un contexto

> **Parte de `01-scenes`.** La aplicación ya está repartida en `core`, `layouts` y `scenes`, pero la sesión viaja por props desde el router.

## Qué toca este paso

Abre `core/router/router.component.tsx`:

```tsx
const { userSession, isChecking, setUserSession, logout } = useAuth();
...
<LoginScene onLogin={setUserSession} />
<PrivateRoutes isLogged={Boolean(userSession)} isChecking={isChecking} />
<AppLayout userName={userSession?.name ?? ""} onLogout={logout} />
```

El router hace de **cartero**: saca la sesión y la reparte, aunque a él no le sirve para nada. Si mañana el detalle quiere pintar "Hola, Rick", habría que pasarla por el router, por la escena... Eso se llama **prop drilling**: taladrar props a través de componentes que no las usan.

La sesión es **transversal** (_cross-cutting_): no es de ninguna pantalla y la necesita media aplicación. Para eso React tiene el **contexto**, y su sitio en la arquitectura es `core`.

```
src/
  core/auth/auth.context.ts                  ← nuevo: el contexto
  core/auth/auth.provider.tsx                ← nuevo: donde vive el estado
  core/auth/auth.hook.ts                     ← ahora lee del contexto
  core/auth/index.ts                         ← exporta el proveedor
  App.tsx                                    ← envuelve con el proveedor
  core/router/router.component.tsx           ← deja de repartir props
  core/router/private-routes.component.tsx   ← lee la sesión con useAuth
  layouts/app.layout.tsx                     ← lee la sesión con useAuth
  scenes/login.scene.tsx                     ← guarda la sesión con useAuth
```

# Pasos

## 1. El contexto

Un contexto es como una **emisora de radio**: el proveedor emite desde arriba y cualquier componente de debajo sintoniza, sin que los de en medio tengan que llevar el mensaje.

_./src/core/auth/auth.context.ts_ — **fichero nuevo**

```ts
import React from "react";
import type { UserSession } from "./auth.vm";

export interface AuthContextModel {
  userSession: UserSession | null;
  isChecking: boolean;
  setUserSession: (userSession: UserSession | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextModel | null>(null);
```

- `AuthContextModel` es **lo que se emite**: exactamente lo que devolvía `useAuth`.
- El valor inicial es `null` porque fuera del proveedor **no hay sesión que valga**. En vez de inventar un valor por defecto que engañe, dejamos `null` y el hook avisará si alguien lo usa mal.
- Es `.ts` y no `.tsx`: no hay JSX, solo crea el contexto.

## 2. El proveedor: donde vive el estado

El cuerpo del `useAuth` de antes se muda **tal cual** a un componente, que emite el resultado a todo lo que tenga dentro:

_./src/core/auth/auth.provider.tsx_ — **fichero nuevo**

```tsx
import React from "react";
import { AuthContext } from "./auth.context";
import type { UserSession } from "./auth.vm";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const [userSession, setUserSession] = React.useState<UserSession | null>(
    null,
  );
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((userSession) => {
        setUserSession(userSession);
      })
      .catch(() => setUserSession(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUserSession(null);
  };

  return (
    <AuthContext value={{ userSession, isChecking, setUserSession, logout }}>
      {children}
    </AuthContext>
  );
};
```

⚠️ **`<AuthContext value>` sin `.Provider`:** desde React 19 el propio contexto hace de proveedor. En código anterior (y en muchos ejemplos) verás `<AuthContext.Provider value={...}>`; es lo mismo.

## 3. El hook: sintonizar

`useAuth` ya no crea el estado: lo **lee** del contexto.

_./src/core/auth/auth.hook.ts_

```diff
  import React from "react";
- import type { UserSession } from "./auth.vm";
+ import { AuthContext } from "./auth.context";

  export const useAuth = () => {
-   const [userSession, setUserSession] = React.useState<UserSession | null>(
-     null,
-   );
-   const [isChecking, setIsChecking] = React.useState(true);
+   const context = React.useContext(AuthContext);

-   React.useEffect(() => {
-     fetch("/api/me")
-       .then((response) => (response.ok ? response.json() : null))
-       .then((userSession) => {
-         setUserSession(userSession);
-       })
-       .catch(() => setUserSession(null))
-       .finally(() => setIsChecking(false));
-   }, []);
+   if (!context) {
+     throw new Error("useAuth tiene que usarse dentro de <AuthProvider>");
+   }

-   const logout = async () => {
-     await fetch("/api/logout", { method: "POST" });
-     setUserSession(null);
-   };
-
-   return { userSession, isChecking, setUserSession, logout };
+   return context;
  };
```

- **El nombre no cambia.** Quien usa `useAuth` no se entera de que ahora el dato sale de un contexto: la implementación queda escondida.
- **El `throw`:** si alguien usa `useAuth` fuera del proveedor, el error dice exactamente qué pasa, en vez de un `Cannot read properties of null` tres ficheros más allá.

_./src/core/auth/index.ts_

```diff
  export * from "./auth.hook";
+ export * from "./auth.provider";
  export * from "./auth.vm";
```

⚠️ **El contexto no se exporta del barrel.** Desde fuera solo se usan el proveedor y el hook; así nadie hace `useContext(AuthContext)` a mano saltándose la comprobación.

## 4. `App` envuelve con el proveedor

_./src/App.tsx_

```diff
+ import { AuthProvider } from "#core/auth";
  import { Router } from "#core/router";

  const App = () => {
-   return <Router />;
+   return (
+     <AuthProvider>
+       <Router />
+     </AuthProvider>
+   );
  };
```

⚠️ **El proveedor tiene que estar por encima** de todo lo que llame a `useAuth`. Por eso envuelve al router entero: dentro están el portero, el layout y el login.

## 5. Fuera props

**El router deja de repartir** y vuelve a ser solo una lista de rutas:

_./src/core/router/router.component.tsx_

```diff
  import { BrowserRouter, Navigate, Route, Routes } from "react-router";
- import { useAuth } from "#core/auth";
  import { AppLayout } from "#layouts";
  import { CharacterDetailScene, CharacterListScene, LoginScene } from "#scenes";
  import { PrivateRoutes } from "./private-routes.component";
  import { ROUTES } from "./routes";

  export const Router = () => {
-   const { userSession, isChecking, setUserSession, logout } = useAuth();
-
    return (
      <BrowserRouter>
        <Routes>
-         <Route
-           path={ROUTES.LOGIN}
-           element={<LoginScene onLogin={setUserSession} />}
-         />
-         <Route
-           element={
-             <PrivateRoutes
-               isLogged={Boolean(userSession)}
-               isChecking={isChecking}
-             />
-           }
-         >
-           <Route
-             element={
-               <AppLayout userName={userSession?.name ?? ""} onLogout={logout} />
-             }
-           >
+         <Route path={ROUTES.LOGIN} element={<LoginScene />} />
+         <Route element={<PrivateRoutes />}>
+           <Route element={<AppLayout />}>
              <Route path={ROUTES.CHARACTERS} element={<CharacterListScene />} />
```

**Cada consumidor sintoniza lo que necesita.** El portero:

_./src/core/router/private-routes.component.tsx_

```diff
  import { Navigate, Outlet } from "react-router";
+ import { useAuth } from "#core/auth";
  import { ROUTES } from "./routes";

- interface Props {
-   isLogged: boolean;
-   isChecking: boolean;
- }
+ export const PrivateRoutes = () => {
+   const { userSession, isChecking } = useAuth();

- export const PrivateRoutes = (props: Props) => {
-   const { isLogged, isChecking } = props;
-
    if (isChecking) {
  ...
-   return isLogged ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
+   return userSession ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
  };
```

El layout:

_./src/layouts/app.layout.tsx_

```diff
  import { Outlet, useNavigate } from "react-router";
+ import { useAuth } from "#core/auth";
  import { ROUTES } from "#core/router";

- interface Props {
-   userName: string;
-   onLogout: () => Promise<void>;
- }
-
- export const AppLayout = (props: Props) => {
-   const { userName, onLogout } = props;
+ export const AppLayout = () => {
+   const { userSession, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
-     await onLogout();
+     await logout();
      navigate(ROUTES.LOGIN);
    };
  ...
-           <span className="text-sm opacity-70">{userName}</span>
+           <span className="text-sm opacity-70">{userSession?.name}</span>
```

Y el login:

_./src/scenes/login.scene.tsx_

```diff
  import { z } from "zod";
- import type { UserSession } from "#core/auth";
+ import { useAuth } from "#core/auth";
  import { ROUTES } from "#core/router";
  ...
- interface Props {
-   onLogin: (userSession: UserSession) => void;
- }
-
- export const LoginScene = (props: Props) => {
-   const { onLogin } = props;
+ export const LoginScene = () => {
+   const { setUserSession } = useAuth();
    const navigate = useNavigate();
  ...
-       onLogin(data);
+       setUserSession(data);
        navigate(ROUTES.CHARACTERS);
```

⚠️ **No todo va a contexto.** Es para lo **transversal** (sesión, tema, idioma). Si lo usas para no pasar dos props entre padre e hijo, acabas con una aplicación en la que no se sabe de dónde sale nada. Y recuerda que cada cambio del valor repinta a todos los consumidores.

## Cómo queda

```
src/
├── App.tsx                  ← <AuthProvider><Router /></AuthProvider>
├── core/
│   ├── auth/
│   │   ├── auth.context.ts      ← el contexto (no sale del barrel)
│   │   ├── auth.hook.ts         ← useAuth: lee el contexto
│   │   ├── auth.provider.tsx    ← el estado, /api/me y logout
│   │   ├── auth.vm.ts
│   │   └── index.ts
│   └── router/                 ← el router ya no sabe nada de la sesión
├── layouts/
├── scenes/
├── character-card.tsx       ← 🚧 todavía sueltos
├── character.schema.ts      ← 🚧
├── episode-table.tsx        ← 🚧
└── login.schema.ts          ← 🚧
```

## Lo que hemos ganado

| | |
| --- | --- |
| `AuthProvider` | La sesión vive en un único sitio, por encima de todo |
| `useAuth` | Cualquier componente la lee sin que nadie se la pase |
| `Router` | Vuelve a ser una lista de rutas |
| Sin props de sesión | Añadir un consumidor nuevo no obliga a tocar a nadie más |

## Pruébalo

```bash
pnpm install
pnpm start
```

- Login con `admin` / `test`: entras y el nombre sale en la cabecera.
- Recarga en `/characters`: entras directamente (el proveedor pregunta a `/api/me`).
- Salir: vuelves al login, y si intentas ir a `/characters` te devuelve al login.

**Siguiente:** `03-pods` — los cuatro ficheros sueltos encuentran casa, y cada pantalla se parte en quien consigue los datos y quien los pinta.
