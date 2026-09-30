# 02 Cross-cutting — the session in a context

> **Starts from `01-scenes`.** The app is already split into `core`, `layouts` and `scenes`, but the session travels through props from the router.

## What this step covers

Open `core/router/router.component.tsx`:

```tsx
const { userSession, isChecking, setUserSession, logout } = useAuth();
...
<LoginScene onLogin={setUserSession} />
<PrivateRoutes isLogged={Boolean(userSession)} isChecking={isChecking} />
<AppLayout userName={userSession?.name ?? ""} onLogout={logout} />
```

The router acts as a **mail carrier**: it takes the session and hands it out, even though it has no use for it. If tomorrow the detail wants to show "Hi, Rick", it would have to go through the router, the scene... That's called **prop drilling**: drilling props through components that don't use them.

The session is **cross-cutting**: it doesn't belong to any screen and half the app needs it. React has **context** for that, and its place in the architecture is `core`.

```
src/
  core/auth/auth.context.ts                  ← new: the context
  core/auth/auth.provider.tsx                ← new: where the state lives
  core/auth/auth.hook.ts                     ← now reads from the context
  core/auth/index.ts                         ← exports the provider
  App.tsx                                    ← wraps with the provider
  core/router/router.component.tsx           ← stops handing out props
  core/router/private-routes.component.tsx   ← reads the session with useAuth
  layouts/app.layout.tsx                     ← reads the session with useAuth
  scenes/login.scene.tsx                     ← stores the session with useAuth
```

# Steps

## 1. The context

A context is like a **radio station**: the provider broadcasts from the top and any component below tunes in, without the ones in the middle having to carry the message.

_./src/core/auth/auth.context.ts_ — **new file**

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

- `AuthContextModel` is **what gets broadcast**: exactly what `useAuth` used to return.
- The initial value is `null` because outside the provider **there is no valid session**. Instead of inventing a misleading default, we leave `null` and the hook will complain if someone misuses it.
- It's `.ts`, not `.tsx`: no JSX, it only creates the context.

## 2. The provider: where the state lives

The body of the old `useAuth` moves **as is** into a component, which broadcasts the result to everything inside it:

_./src/core/auth/auth.provider.tsx_ — **new file**

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

⚠️ **`<AuthContext value>` without `.Provider`:** since React 19 the context itself acts as the provider. In older code (and many examples) you'll see `<AuthContext.Provider value={...}>`; it's the same thing.

## 3. The hook: tuning in

`useAuth` no longer creates the state: it **reads** it from the context.

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

- **The name doesn't change.** Whoever uses `useAuth` doesn't notice the data now comes from a context: the implementation stays hidden.
- **The `throw`:** if someone uses `useAuth` outside the provider, the error says exactly what's wrong, instead of a `Cannot read properties of null` three files away.

_./src/core/auth/index.ts_

```diff
  export * from "./auth.hook";
+ export * from "./auth.provider";
  export * from "./auth.vm";
```

⚠️ **The context isn't exported from the barrel.** From outside you only use the provider and the hook, so nobody calls `useContext(AuthContext)` by hand and skips the check.

## 4. `App` wraps with the provider

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

⚠️ **The provider must be above** everything that calls `useAuth`. That's why it wraps the whole router: the guard, the layout and the login are inside it.

## 5. Props are gone

**The router stops handing things out** and is just a list of routes again:

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

**Each consumer tunes in to what it needs.** The guard:

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

The layout:

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

And the login:

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

⚠️ **Not everything belongs in a context.** It's for **cross-cutting** things (session, theme, language). If you use it to avoid passing two props from parent to child, you end up with an app where nobody knows where anything comes from. And remember every change of the value re-renders all consumers.

## Result

```
src/
├── App.tsx                  ← <AuthProvider><Router /></AuthProvider>
├── core/
│   ├── auth/
│   │   ├── auth.context.ts      ← the context (not exported from the barrel)
│   │   ├── auth.hook.ts         ← useAuth: reads the context
│   │   ├── auth.provider.tsx    ← state, /api/me and logout
│   │   ├── auth.vm.ts
│   │   └── index.ts
│   └── router/                 ← the router knows nothing about the session
├── layouts/
├── scenes/
├── character-card.tsx       ← 🚧 still loose
├── character.schema.ts      ← 🚧
├── episode-table.tsx        ← 🚧
└── login.schema.ts          ← 🚧
```

## What we gained

| | |
| --- | --- |
| `AuthProvider` | The session lives in a single place, above everything |
| `useAuth` | Any component reads it without anyone passing it down |
| `Router` | Back to being a list of routes |
| No session props | Adding a new consumer doesn't force you to touch anyone else |

## Try it

```bash
pnpm install
pnpm start
```

- Login with `admin` / `test`: you get in and the name shows in the header.
- Reload on `/characters`: you get straight in (the provider asks `/api/me`).
- `Salir` (Log out): back to the login, and if you try `/characters` it sends you back to the login.

**Next:** `03-pods` — the four loose files find a home, and each screen is split into who gets the data and who renders it.
