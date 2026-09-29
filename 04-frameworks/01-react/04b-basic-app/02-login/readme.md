# 02 Login — a real session, with a cookie

**Starts from:** `01-routing`.

There the session was **a fake boolean**: you clicked "Entrar" and you were in. Here the login **talks to the server**, the server decides, and the session moves into a **cookie**. On top of that, reloading the page no longer loses it.

## What this step touches

```
src/
  login.tsx             ← the form, now against /api/login
  session.tsx           ← new: who am I, according to the server
  private-routes.tsx    ← learns to wait while the session is checked
  app-layout.tsx        ← greets the user and logs out for real
  App.tsx               ← uses the real session instead of the boolean
```

## What the server offers

Already done, in `server/index.ts`:

| Method | Route         | What it does                                                     |
| ------ | ------------- | ---------------------------------------------------------------- |
| `POST` | `/api/login`  | Checks username and password. If valid, **sets the session cookie** |
| `GET`  | `/api/me`     | Tells who you are by reading that cookie. **`401`** if no session |
| `POST` | `/api/logout` | Clears the cookie                                                |

The cookie is set with `httpOnly: true`. **The page's JavaScript can't read it**: it doesn't show up in `document.cookie`. The browser stores it and sends it on every request, but your code never sees it. So if someone manages to inject JavaScript into the page (XSS), there's no token to steal. The price: **the front doesn't know whether there's a session** and has to ask (step 2).

# Steps

## 1. The login form

The login goes from a button to a real form that sends username and password to the server. This is the full file; it's explained piece by piece below.

_./src/login.tsx_

```tsx
import React from "react";
import { useNavigate } from "react-router";

interface User {
  username: string;
  name: string;
}

interface Props {
  onLogin: (user: User) => void;
}

export const LoginPage = (props: Props) => {
  const { onLogin } = props;
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      onLogin(data);
      navigate("/characters");
    } catch {
      setError("No se ha podido conectar con el servidor");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="hero min-h-screen">
      <div className="card bg-base-100 border-base-300 w-full max-w-sm border shadow-2xl">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h1 className="card-title justify-center text-2xl">
            Rick &amp; Morty
          </h1>
          <label className="floating-label">
            <span>Usuario</span>
            <input
              className="input w-full"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Contraseña</span>
            <input
              className="input w-full"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isPending ? "Entrando..." : "Entrar"}
          </button>
          <p className="text-sm opacity-60">Prueba con admin / test</p>
        </form>
      </div>
    </main>
  );
};
```

### Controlled fields

`value` and `onChange` go **together**: what's on screen **is** what's in state. With `value` but no `onChange`, the input freezes.

### Submitting: `onSubmit` and `preventDefault`

The button is `type="submit"` inside a `<form>`, so **Enter** works too. But a `<form>` is plain HTML: when submitted, it **navigates** (by default with `get`, to the same url, with the fields in the url). In an SPA that reloads the whole app and everything is lost.

```tsx
event.preventDefault(); // cancel the browser submit; we do it ourselves with fetch
```

⚠️ Without `preventDefault`, the address bar would end up showing `/login?username=admin&password=test`: **the password in plain sight**.

The event type is `React.SubmitEvent<HTMLFormElement>`. Many examples use `React.FormEvent`, but it's marked as deprecated.

### The request: `fetch` and `response.ok`

```tsx
const response = await fetch("/api/login", { method: "POST", ... });
const data = await response.json();

if (!response.ok) {
  setError(data.message);
  return;
}
```

⚠️ **For `fetch`, a `401` is not an error.** Getting an answer from the server is already a success; whether it's a good answer is up to you to check with `response.ok`. The body is read separately with `response.json()`.

With valid credentials the server returns `{ username, name }`. That's why `onLogin` now **carries data** and its type becomes `(user: User) => void`.

### The error and "I'm waiting"

- **`error`**: the message comes from the server ("Usuario o contraseña no válidos"). ⚠️ The `setError("")` at the start is essential: without it, the previous attempt's error stays on screen.
- **`isPending`**: the server takes almost a second. Meanwhile the button is disabled and shows a spinner.
- **`catch`** means "nobody answered" (no network, server down), different from `!response.ok` ("it answered no").
- ⚠️ **`finally` is not optional**: if you reset `isPending` at the end of the `try`, the day something fails the button stays disabled forever.

### The card

`hero` centres on screen, `card` draws the box with its shadow and `card-body` lays out the content. All daisyUI, no custom CSS.

➡️ Note the login declares **its own `interface User`**, the same one `session.tsx` will export. It's a small duplication fixed in `../05-architecture/01-scenes`.

That's **four state variables** now (two fields, the error and the pending flag), and none of them is about the app's business: it's the plumbing of any form.

## 2. Who am I? The session

Since the cookie is `httpOnly`, **on startup we don't know if there's a session**. We have to ask the server with `/api/me`.

_./src/session.tsx_ — **new file**

```tsx
import React from "react";

export interface User {
  username: string;
  name: string;
}

export const useSession = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => {
        setUser(user);
      })
      .catch(() => setUser(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return { user, isChecking, setUser, logout };
};
```

It's a **custom hook**: it takes everything session-related out of the components.

### Why `isChecking`?

The effect runs **after** rendering. During that time `user` is `null`… the same `null` as when there's no session. Without another value, `null` would mean two opposite things:

|                    | Meaning                                  | What to do        |
| ------------------ | ---------------------------------------- | ----------------- |
| `isChecking: true` | We're still asking                       | **Wait**          |
| `user: null`       | We asked: there's no session             | Send to login     |
| `user: {...}`      | We asked: there's a session, and whose   | Let through       |

This isn't about cookies: **it happens with anything async**. Loading, success and failure. It'll come back with the list.

## 3. Wiring it into `App.tsx`

_./src/App.tsx_

```diff
- import React from "react";
  import { BrowserRouter, Navigate, Route, Routes } from "react-router";
- import { AppLayout } from "./app-layout";
- import { CharacterDetailPage } from "./character-detail";
- import { CharacterListPage } from "./character-list";
  import { LoginPage } from "./login";
+ import { CharacterListPage } from "./character-list";
+ import { CharacterDetailPage } from "./character-detail";
  import { PrivateRoutes } from "./private-routes";
+ import { AppLayout } from "./app-layout";
+ import { useSession } from "./session";

  const App = () => {
-   const [isLogged, setIsLogged] = React.useState(false);
+   const { user, isChecking, setUser, logout } = useSession();

    return (
      <BrowserRouter>
        <Routes>
+         <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route
-           path="/login"
-           element={<LoginPage onLogin={() => setIsLogged(true)} />}
-         />
-
-         <Route element={<PrivateRoutes isLogged={isLogged} />}>
-           <Route element={<AppLayout onLogout={() => setIsLogged(false)} />}>
+           element={
+             <PrivateRoutes isLogged={Boolean(user)} isChecking={isChecking} />
+           }
+         >
+           <Route
+             element={
+               <AppLayout userName={user?.name ?? ""} onLogout={logout} />
+             }
+           >
              <Route path="/characters" element={<CharacterListPage />} />
              <Route path="/characters/:id" element={<CharacterDetailPage />} />
            </Route>
```

`onLogin={setUser}`: the login receives the setter and pushes up the user the server returned. Same pattern as before, but now the notification carries data.

## 4. The guard learns to wait

_./src/private-routes.tsx_

```diff
  interface Props {
    isLogged: boolean;
+   isChecking: boolean;
  }

  export const PrivateRoutes = (props: Props) => {
-   const { isLogged } = props;
+   const { isLogged, isChecking } = props;
+
+   if (isChecking) {
+     return (
+       <div className="flex min-h-screen items-center justify-center">
+         <span className="loading loading-spinner loading-lg"></span>
+       </div>
+     );
+   }

    return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
  };
```

⚠️ **Without this, it's a silent bug:** the app works until someone refreshes on `/characters`, and then they're kicked to login. The session does last (the cookie is still there); we just didn't give the server time to answer.

## 5. Logging out for real, and greeting the user

Logging out is no longer setting a boolean to `false`: the server has to clear the cookie. Otherwise, you'd still be in after reloading.

_./src/app-layout.tsx_

```diff
  interface Props {
-   onLogout: () => void;
+   userName: string;
+   onLogout: () => Promise<void>;
  }

  export const AppLayout = (props: Props) => {
-   const { onLogout } = props;
-
+   const { userName, onLogout } = props;
    const navigate = useNavigate();

-   const handleLogout = () => {
-     onLogout();
+   const handleLogout = async () => {
+     await onLogout();
      navigate("/login");
    };
```

```diff
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
-       <button className="btn btn-outline btn-sm" onClick={handleLogout}>
-         Salir
-       </button>
+       <div className="flex items-center gap-4">
+         <span className="text-sm opacity-70">{userName}</span>
+         <button className="btn btn-outline btn-sm" onClick={handleLogout}>
+           Salir
+         </button>
+       </div>
```

Name and button are grouped in a `div` so they sit together on the right; the brand, with `flex-1`, fills the gap.

## Try it

```bash
pnpm start
```

1. **Wrong password.** The server's message shows in red and you stay on login.
2. **`admin` / `test`.** You get in, and **Rick Sanchez** appears at the top: that name comes from the server.
3. **Refresh on `/characters`.** You stay in, with a brief spinner while `/api/me` answers.
4. **Look at the cookie.** DevTools → _Application → Cookies_: `session` is there, marked **HttpOnly**. Type `document.cookie` in the console: **it's empty**.
5. **Salir**, then try `/characters` again: out.

⚠️ **Warnings:**

- You'll see a **`401` in the console when the login loads**: it's `/api/me` saying "no session". It shows twice in development because of `StrictMode`.
- **No validation yet.** An empty form is still sent and the server rejects it. That's the next step.
- The cookie **expires in an hour**: if you come back later, you'll have to log in again.

**Next:** `03-login-zod` — validate before sending, with zod.
