# 01 Routing — several screens and a private area

**Starts from:** `00-boilerplate`.

So far the app was **a single screen**. We turn it into three —login, list and detail— and put the list and the detail **behind a guard**, so you can't get in without going through the login.

We **don't talk to the server yet**: the login checks nothing and the screens are just a title and a button. This step is only about routes.

## What a router is

A React app lives in **a single page** (`index.html`). To have several screens without reloading, JavaScript decides what to render based on the url: that's an **SPA** (_single page application_), and what manages it is a **router**. A router is basically **a map: for this url, render this component**.

## What this step touches

All files loose in `src/`, no folders (organising them is exactly what `../../05b-architecture` is about):

```
src/
  App.tsx               ← rewritten: the route map lives here
  login.tsx             ← new: login screen
  character-list.tsx    ← new: list screen
  character-detail.tsx  ← new: detail screen
  private-routes.tsx    ← new: the guard for the private area
  app-layout.tsx        ← new: the shared header
```

# Steps

## 1. Install React Router

```bash
pnpm add react-router
```

⚠️ **Mind the name.** For years people installed `react-router-dom`, and you'll see it in many tutorials. Since version 7 both packages were merged: in new projects install **`react-router`** and import from it.

React Router can be used in two ways: **declarative** (`<BrowserRouter>`, `<Routes>`, `<Route>` components in JSX, each screen fetches its own data) or as a **data router** (`createBrowserRouter` with a `loader` and `action` per route). We use the declarative one: it's the easiest to read and the one you'll find most. The route map is the same in both.

## 2. The list and detail screens

Deliberately simple: a title and a link. What matters today is navigation.

_./src/character-list.tsx_

```tsx
import { Link } from "react-router";

export const CharacterListPage = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold">Personajes</h2>
      <Link className="btn btn-primary" to="/characters/2">
        Ver el detalle de Morty
      </Link>
    </div>
  );
};
```

_./src/character-detail.tsx_

```tsx
import { Link, useParams } from "react-router";

export const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold">Detalle del personaje</h2>
      <h3>Id: {id}</h3>
      <Link className="btn btn-primary" to="/characters">
        Volver al listado
      </Link>
    </div>
  );
};
```

- **`Link`** renders a real `<a>`, but intercepts the click and changes the url **without reloading**.
- **`useParams`** reads url parameters: in `/characters/:id`, the `:id`. It **always returns a string**; if you need a number, `Number(id)`.

⚠️ **Don't use `<a href>` to navigate inside the app.** It works, but reloads the whole page: state is lost, everything is downloaded again and it flickers.

➡️ They're wrapped in a `<div>` rather than a `<main>` because the layout provides the `<main>` (step 5).

## 3. The login screen and `useNavigate`

_./src/login.tsx_

```tsx
import { useNavigate } from "react-router";

interface Props {
  onLogin: () => void;
}

export const LoginPage = (props: Props) => {
  const { onLogin } = props;
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin();
    navigate("/characters");
  };
  return (
    <>
      <h2>Pantalla de login</h2>
      <button className="btn btn-primary" onClick={handleLogin}>
        Entrar
      </button>
    </>
  );
};
```

- **`useNavigate`** navigates **from code**, when your code makes the decision: a successful login, a save, a delete. `Link` is a link the user clicks; `navigate` is an order.
- **`onLogin`** is how the screen tells its parent the user got in. Who stores that is up to `App` (step 4).

## 4. The route map and the private area

### The session (fake, for now)

There's no server involved yet, so the session is **a boolean** in `App`. It lives **above the routes** so it survives screen changes. In `02-login` it's replaced by the real cookie session.

### The guard

_./src/private-routes.tsx_

```tsx
import { Navigate, Outlet } from "react-router";

interface Props {
  isLogged: boolean;
}

export const PrivateRoutes = (props: Props) => {
  const { isLogged } = props;

  return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
};
```

- **`<Outlet />`** means "the matching child route goes here". It's a slot the router fills.
- **`<Navigate replace>`** redirects replacing the url in history. Without `replace`, the back button takes you to the forbidden url, which redirects again: you're trapped.

⚠️ **This is convenience, not security.** Everything runs in the user's browser. What really protects the data is the server.

## 5. The layout: the shared header

_./src/app-layout.tsx_

```tsx
import { Outlet, useNavigate } from "react-router";

interface Props {
  onLogout: () => void;
}

export const AppLayout = (props: Props) => {
  const { onLogout } = props;

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-200 px-6">
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Salir
        </button>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
};
```

Same `<Outlet />` mechanism, but for what repeats in every private screen. Navigating between list and detail, the header **isn't remounted**: only the slot content changes.

## 6. `App.tsx`: all together

The boilerplate home page (the compiler demo) **is replaced entirely**:

_./src/App.tsx_

```tsx
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./app-layout";
import { CharacterDetailPage } from "./character-detail";
import { CharacterListPage } from "./character-list";
import { LoginPage } from "./login";
import { PrivateRoutes } from "./private-routes";

const App = () => {
  const [isLogged, setIsLogged] = React.useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLogged(true)} />}
        />

        <Route element={<PrivateRoutes isLogged={isLogged} />}>
          <Route element={<AppLayout onLogout={() => setIsLogged(false)} />}>
            <Route path="/characters" element={<CharacterListPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

**The pieces:**

- **`<BrowserRouter>`** — placed once, wrapping everything. It watches the browser url.
- **`<Routes>`** — the map container. It renders **only the best matching route**.
- **`<Route path element>`** — one line of the map: for this url, this component.
- **Routes without `path`** (guard and layout) — they don't represent a url, they just wrap their children. They're called _layout routes_. Read it out loud: to reach the list you go through the guard, then the layout.
- **`path="*"`** — the catch-all. ⚠️ Without it, a mistyped url renders **a blank page** with no error.

**Data goes down through props and notifications go up through functions.** `App` owns the state and passes a function to the login (`onLogin`) and another to the layout (`onLogout`). Children don't touch the parent's state: they just notify it.

⚠️ **Mind the arrow:** `onLogin={() => setIsLogged(true)}` passes a function **without calling it**. With `onLogin={setIsLogged(true)}` you'd be calling it during render: infinite loop.

## 7. `BrowserRouter` or `HashRouter`

With `BrowserRouter` urls are clean (`/characters`), but on **refresh** the browser asks the server for that path. In development Vite handles it; in production, a plain file server answers **404**:

```bash
pnpm build
npx serve dist -l 4200      # navigate, refresh on /characters → 404
npx serve -s dist -l 4200   # -s: serve index.html for everything → works
```

`HashRouter` puts routes after a hash (`/#/characters`). The browser **never sends what comes after `#` to the server**, so it works without any setup.

|                            | `BrowserRouter`   | `HashRouter`    |
| -------------------------- | ----------------- | --------------- |
| **Url**                    | `/characters`     | `/#/characters` |
| **Server setup needed**    | Yes (one line)    | No              |
| **If not configured**      | 404 on refresh    | Works anyway    |

Use **`BrowserRouter` by default** (real urls that can be shared and indexed). `HashRouter` when you can't touch the server.

## Try it

```bash
pnpm start
```

1. Open <http://localhost:5173>: you land on `/login`, because the root matches no route.
2. Type `/characters` in the address bar: you're sent back to login. The guard works.
3. Click **Entrar**: you reach the list, with the header on top.
4. Click the link: the url becomes `/characters/2` and the detail shows `Id: 2`. The page **doesn't reload**.
5. Click **Salir** and try `/characters` again: out.

⚠️ **Refreshing loses the session.** That's expected: the boolean lives in memory. Fixed in the next step.

**Next:** `02-login` — the login talks to the server and the session moves into a cookie.
