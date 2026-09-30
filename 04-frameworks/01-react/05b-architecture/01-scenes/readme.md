# 01 Routes, layouts and scenes

> **Starts from `../../04b-basic-app/05-detail`**, the code as we left it in class. No new boilerplate: we take the working app and put things in place.

## What this step covers

The app works. The problem is **where each thing lives**: thirteen loose files in `src/`, and the answer to "where do I put the next thing?" is "well... somewhere".

In this step:

- the **`#` alias**, to stop counting folders when importing,
- **`core/router`**: urls in one place and one place only,
- **`core/auth`**: the session, used by the whole app,
- **`layouts`**: what wraps the screens,
- **`scenes`**: the screens, with their name and their place.

```
src/
  core/router/routes.ts                     ← new
  core/router/router.component.tsx          ← new (comes out of App.tsx)
  core/router/private-routes.component.tsx  ← moved (was private-routes.tsx)
  core/router/index.ts                      ← new
  core/auth/auth.vm.ts                      ← new
  core/auth/auth.hook.ts                    ← moved (was session.tsx)
  core/auth/index.ts                        ← new
  layouts/app.layout.tsx                    ← moved (was app-layout.tsx)
  layouts/center.layout.tsx                 ← new
  layouts/index.ts                          ← new
  scenes/login.scene.tsx                    ← moved (was login.tsx)
  scenes/character-list.scene.tsx           ← moved (was character-list.tsx)
  scenes/character-detail.scene.tsx         ← moved (was character-detail.tsx)
  scenes/index.ts                           ← new
  App.tsx                                   ← down to three lines
```

## Where we start

```
App.tsx              app-layout.tsx        character-card.tsx
character-detail.tsx character-list.tsx    character.schema.ts
episode-table.tsx    index.css             login.schema.ts
login.tsx            main.tsx              private-routes.tsx
session.tsx
```

Look at that list and answer: which ones are **screens**? Which ones are **pieces** used by screens? Which ones are neither, but app **plumbing**? The answers are in your head, not in the project. By the end of this step, the folder structure will answer by itself.

⚠️ **Nothing here changes what the app does.** When we finish, everything works exactly the same.

# Steps

## 1. The `#` alias

Before moving anything, prepare the ground. As soon as we nest folders, imports would look like `../../../character.schema`, and that breaks as soon as you move a file.

It's declared in `package.json` using a standard Node feature, **subpath imports**:

_./package.json_

```diff
    "type": "module",
+   "imports": {
+     "#*": "./src/*"
+   },
```

TypeScript needs to know too, because it doesn't read that part of `package.json` to resolve types:

_./tsconfig.app.json_

```diff
    "types": ["vite/client"],
+   "paths": {
+     "#*": ["./src/*"]
+   },
```

From now on, `#core/router` means the same thing **from any file in the project**.

⚠️ **No slash:** it's `#core/router`, not `#/core/router`. The pattern is `"#*"`, so the hash sticks to the folder name.

⚠️ **Both files are needed:** Vite resolves imports when building (reading `package.json`) and TypeScript when type-checking and autocompleting in the editor. If one is missing, either the app doesn't start or the editor paints everything red. If the editor doesn't pick it up, restart the TypeScript server (`TypeScript: Restart TS Server`).

## 2. `core/router`: urls in one place

Search for `"/characters"` in the project: it's in the router, the card, the detail (four times, two of them as templates)... and `"/login"` in as many places. A url typed by hand in more than one place is a typo waiting to happen.

_./src/core/router/routes.ts_ — **new file**

```ts
export const ROUTES = {
  LOGIN: "/login",
  CHARACTERS: "/characters",
  CHARACTER_DETAIL: "/characters/:id",
};
```

**The guard moves** and uses the constant:

```bash
mv src/private-routes.tsx src/core/router/private-routes.component.tsx
```

_./src/core/router/private-routes.component.tsx_

```diff
  import { Navigate, Outlet } from "react-router";
+ import { ROUTES } from "./routes";

  ...
- return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
+ return isLogged ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
```

The `.component.tsx` suffix tells you what kind of thing the file is. You'll keep seeing `.hook`, `.vm`, `.layout`, `.scene`...

**The barrel**, which turns a folder into a piece with a front door:

_./src/core/router/index.ts_ — **new file**

```ts
export * from "./routes";
```

A barrel (`index.ts`) says **what can be used from this folder from the outside**. Whoever imports `#core/router` gets `ROUTES`; whether `private-routes.component.tsx` exists is the folder's own business.

⚠️ **The router itself (what lives in `App.tsx` today) comes in step 6.** It imports the session, the layouts and the scenes, and none of those folders exist yet. Writing it now would leave everything red until the end.

## 3. `core/auth`: the plumbing

The session isn't a screen, nor a piece of a screen: the **whole** app uses it (the guard to let you in, the layout to show your name, the login to store it). That's what `core` means.

```bash
mkdir -p src/core/auth
mv src/session.tsx src/core/auth/auth.hook.ts
```

And it's split in two: the model on one side and the hook on the other.

_./src/core/auth/auth.vm.ts_ — **new file**

```ts
export interface UserSession {
  username: string;
  name: string;
}
```

_./src/core/auth/auth.hook.ts_

```diff
  import React from "react";
+ import type { UserSession } from "./auth.vm";

- export interface User {
-   username: string;
-   name: string;
- }
-
- export const useSession = () => {
-   const [user, setUser] = React.useState<User | null>(null);
+ export const useAuth = () => {
+   const [userSession, setUserSession] = React.useState<UserSession | null>(
+     null,
+   );
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
      fetch("/api/me")
        .then((response) => (response.ok ? response.json() : null))
-       .then((user) => {
-         setUser(user);
+       .then((userSession) => {
+         setUserSession(userSession);
        })
-       .catch(() => setUser(null))
+       .catch(() => setUserSession(null))
        .finally(() => setIsChecking(false));
    }, []);

    const logout = async () => {
      await fetch("/api/logout", { method: "POST" });
-     setUser(null);
+     setUserSession(null);
    };

-   return { user, isChecking, setUser, logout };
+   return { userSession, isChecking, setUserSession, logout };
  };
```

_./src/core/auth/index.ts_ — **new file**

```ts
export * from "./auth.hook";
export * from "./auth.vm";
```

Three naming details:

- **`auth`, not `session`**: that's the name Lemoncode projects use. Pick whichever, but keep it the same across the team.
- **`.vm`** means _view model_: the data as the app needs it, which doesn't have to match what the server sends. You'll see it up close in `04-api`.
- **From `.tsx` to `.ts`**: there's no JSX inside. It's a hook, not a component.

⚠️ **The logic doesn't change** and the session is still passed through props from the router (you'll see it in step 6). That's solved in `02-cross-cutting`.

## 4. `layouts`: what wraps

The private-area layout already existed; it just moves and uses `ROUTES`:

```bash
mkdir -p src/layouts
mv src/app-layout.tsx src/layouts/app.layout.tsx
```

_./src/layouts/app.layout.tsx_

```diff
  import { Outlet, useNavigate } from "react-router";
+ import { ROUTES } from "#core/router";

  ...
    const handleLogout = async () => {
      await onLogout();
-     navigate("/login");
+     navigate(ROUTES.LOGIN);
    };
```

**And a new one shows up.** The login starts with `<main className="hero min-h-screen">`, which means "center this on the screen". That doesn't belong to the login: it belongs to any public screen (a sign-up, a "forgot my password"...).

_./src/layouts/center.layout.tsx_ — **new file**

```tsx
import type React from "react";

interface Props {
  children: React.ReactNode;
}

export const CenterLayout = (props: Props) => {
  const { children } = props;

  return <main className="hero min-h-screen">{children}</main>;
};
```

_./src/layouts/index.ts_ — **new file**

```ts
export * from "./app.layout";
export * from "./center.layout";
```

A layout is a component that receives `children` (or, like the app one, renders an `<Outlet />`). What changes isn't the code but the criterion: it holds what repeats around several screens.

## 5. `scenes`: the screens

The three screens, with the name that identifies them:

```bash
mkdir -p src/scenes
mv src/login.tsx            src/scenes/login.scene.tsx
mv src/character-list.tsx   src/scenes/character-list.scene.tsx
mv src/character-detail.tsx src/scenes/character-detail.scene.tsx
```

| Before | Now |
| --- | --- |
| `LoginPage` | `LoginScene` |
| `CharacterListPage` | `CharacterListScene` |
| `CharacterDetailPage` | `CharacterDetailScene` |

Rename them with **F2** in the editor so the imports are updated too.

**The login** uses the session type (goodbye to its copy of `interface User`), the routes and its new layout:

_./src/scenes/login.scene.tsx_

```diff
  import React from "react";
  import { useNavigate } from "react-router";
  import { z } from "zod";
- import { loginSchema, type Credentials } from "./login.schema";
-
- interface User {
-   username: string;
-   name: string;
- }
+ import type { UserSession } from "#core/auth";
+ import { ROUTES } from "#core/router";
+ import { CenterLayout } from "#layouts";
+ import { loginSchema, type Credentials } from "#login.schema";

  type FieldErrors = Partial<Record<keyof Credentials, string[]>>;

  interface Props {
-   onLogin: (user: User) => void;
+   onLogin: (userSession: UserSession) => void;
  }

- export const LoginPage = (props: Props) => {
+ export const LoginScene = (props: Props) => {
  ...
        onLogin(data);
-       navigate("/characters");
+       navigate(ROUTES.CHARACTERS);
  ...
    return (
-     <main className="hero min-h-screen">
+     <CenterLayout>
        <div className="card bg-base-100 border-base-300 w-full max-w-sm border shadow-2xl">
          ...
        </div>
-     </main>
+     </CenterLayout>
    );
```

**The list** only changes the card import and the name:

_./src/scenes/character-list.scene.tsx_

```diff
  import React from "react";
- import { CharacterCard } from "./character-card";
+ import { CharacterCard } from "#character-card";
  ...
- export const CharacterListPage = () => {
+ export const CharacterListScene = () => {
```

**Links are built with `generatePath`**, the React Router function that fills in a route's `:parameters`:

_./src/character-card.tsx_

```diff
- import { Link } from "react-router";
- import type { Character } from "./character-list";
+ import { Link, generatePath } from "react-router";
+ import { ROUTES } from "#core/router";
+ import type { Character } from "#scenes/character-list.scene";
  ...
      <Link
        className="card bg-base-100 border-base-300 border transition hover:-translate-y-1 hover:shadow-lg"
-       to={`/characters/${character.id}`}
+       to={generatePath(ROUTES.CHARACTER_DETAIL, { id: String(character.id) })}
      >
```

Why not a template string? Because `` `/characters/${id}` `` compiles even if the real route is `/personajes/:id`, and you don't find out until someone clicks. `generatePath` starts from **the same constant the router uses**.

⚠️ **Look at the type import:** the card takes `Character` **from a scene** (`#scenes/character-list.scene`). A piece shouldn't depend on a screen. It's fixed in `03-pods`, when the card and its type move together.

**The detail**: `#` imports, the name and the four links:

_./src/scenes/character-detail.scene.tsx_

```diff
  import React from "react";
- import { Link, useParams } from "react-router";
- import {
-   characterDetailSchema,
-   type CharacterDetail,
- } from "./character.schema";
+ import { Link, generatePath, useParams } from "react-router";
+ import { ROUTES } from "#core/router";
+ import { characterDetailSchema, type CharacterDetail } from "#character.schema";
  import z from "zod";
- import { EpisodeTable } from "./episode-table";
+ import { EpisodeTable } from "#episode-table";

- export const CharacterDetailPage = () => {
+ export const CharacterDetailScene = () => {
  ...
-         <Link className="btn btn-primary" to="/characters">
+         <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
            Volver al listado
          </Link>
  ...
-       <Link className="btn btn-ghost w-fit" to="/characters">
+       <Link className="btn btn-ghost w-fit" to={ROUTES.CHARACTERS}>
          ← Volver al listado
        </Link>
  ...
            <Link
              className="btn join-item"
-             to={`/characters/${character.id - 1}`}
+             to={generatePath(ROUTES.CHARACTER_DETAIL, {
+               id: String(character.id - 1),
+             })}
            >
              Anterior
            </Link>
  ...
-         <Link className="btn join-item" to={`/characters/${character.id + 1}`}>
+         <Link
+           className="btn join-item"
+           to={generatePath(ROUTES.CHARACTER_DETAIL, {
+             id: String(character.id + 1),
+           })}
+         >
            Siguiente
          </Link>
```

**The episodes table** only changes its import:

_./src/episode-table.tsx_

```diff
- import type { Episode } from "./character.schema";
+ import type { Episode } from "#character.schema";
```

**And the scenes barrel:**

_./src/scenes/index.ts_ — **new file**

```ts
export * from "./character-detail.scene";
export * from "./character-list.scene";
export * from "./login.scene";
```

## 6. The router and `App`

With `core/auth`, `layouts` and `scenes` in place, the router can now come out of `App.tsx`.

**The router**, which is what `App.tsx` contains today, with urls replaced by constants and components with the names we gave them in step 5. Everything it imports now exists: `#core/auth`, `#layouts` and `#scenes`.

_./src/core/router/router.component.tsx_ — **new file**

```tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useAuth } from "#core/auth";
import { AppLayout } from "#layouts";
import { CharacterDetailScene, CharacterListScene, LoginScene } from "#scenes";
import { PrivateRoutes } from "./private-routes.component";
import { ROUTES } from "./routes";

export const Router = () => {
  const { userSession, isChecking, setUserSession, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={<LoginScene onLogin={setUserSession} />}
        />
        <Route
          element={
            <PrivateRoutes
              isLogged={Boolean(userSession)}
              isChecking={isChecking}
            />
          }
        >
          <Route
            element={
              <AppLayout userName={userSession?.name ?? ""} onLogout={logout} />
            }
          >
            <Route path={ROUTES.CHARACTERS} element={<CharacterListScene />} />
            <Route
              path={ROUTES.CHARACTER_DETAIL}
              element={<CharacterDetailScene />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

**The barrel** exposes it:

_./src/core/router/index.ts_

```diff
+ export * from "./router.component";
  export * from "./routes";
```

**And `App.tsx` ends up like this:**

_./src/App.tsx_

```tsx
import { Router } from "#core/router";

const App = () => {
  return <Router />;
};

export default App;
```

`App` no longer knows which screens the app has: add one tomorrow and it doesn't change.

## Result

```
src/
├── App.tsx                  ← three lines
├── main.tsx
├── index.css
│
├── core/                    ← plumbing: what the whole app uses
│   ├── auth/
│   │   ├── auth.hook.ts
│   │   ├── auth.vm.ts
│   │   └── index.ts
│   └── router/
│       ├── index.ts
│       ├── private-routes.component.tsx
│       ├── router.component.tsx
│       └── routes.ts
│
├── layouts/                 ← what wraps the screens
│   ├── app.layout.tsx
│   ├── center.layout.tsx
│   └── index.ts
│
├── scenes/                  ← the screens
│   ├── character-detail.scene.tsx
│   ├── character-list.scene.tsx
│   ├── login.scene.tsx
│   └── index.ts
│
├── character-card.tsx       ← 🚧 still loose
├── character.schema.ts      ← 🚧
├── episode-table.tsx        ← 🚧
└── login.schema.ts          ← 🚧
```

The four files at the bottom aren't an oversight: they're **the pieces of each screen**, and their place comes in `03-pods`.

## What we gained

| | |
| --- | --- |
| `#` | Imports don't depend on where the file is |
| `ROUTES` | Urls in one place. Changing one means changing one line |
| `core/` | What the whole app uses, separated from the screens |
| `layouts/` | What repeats around the screens |
| `scenes/` | Each screen, with its name |
| `index.ts` | Each folder decides what it shows to the rest |

## Try it

```bash
pnpm install
pnpm start
```

- Login with `admin` / `test`, list, detail, `Anterior`/`Siguiente` (Previous/Next) and `Salir` (Log out): all the same as before.
- Reload on `/characters` with an open session: you get straight in.

**Still pending:** the router takes the session and hands it down through props to the login, the guard and the layout (**prop drilling**).

**Next:** `02-cross-cutting` — the session in a context.
