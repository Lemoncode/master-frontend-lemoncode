# 02 Login — sesión de verdad, con cookie

**Parte de:** `01-routing`.

Allí la sesión era **un booleano de mentira**: pulsabas «Entrar» y pasabas. Aquí el login **habla con el servidor**, el servidor decide, y la sesión pasa a vivir en una **cookie**. Además, al recargar la página ya no se pierde.

## Qué toca este paso

```
src/
  login.tsx             ← el formulario, ahora contra /api/login
  session.tsx           ← nuevo: quién soy, según el servidor
  private-routes.tsx    ← aprende a esperar mientras se comprueba la sesión
  app-layout.tsx        ← saluda al usuario y cierra sesión de verdad
  App.tsx               ← usa la sesión real en vez del booleano
```

## Lo que ofrece el servidor

Ya está hecho, en `server/index.ts`:

| Método | Ruta          | Qué hace                                                               |
| ------ | ------------- | ---------------------------------------------------------------------- |
| `POST` | `/api/login`  | Comprueba usuario y contraseña. Si valen, **deja la cookie de sesión** |
| `GET`  | `/api/me`     | Dice quién eres leyendo esa cookie. **`401`** si no hay sesión         |
| `POST` | `/api/logout` | Borra la cookie                                                        |

La cookie se deja con `httpOnly: true`. **El JavaScript de la página no puede leerla**: no sale en `document.cookie`. El navegador la guarda y la manda sola en cada petición, pero tu código nunca la ve. Así, si alguien consigue colar JavaScript en la página (un XSS), no hay token que robar. El precio: **el front no sabe si hay sesión** y tiene que preguntar (paso 2).

# Pasos

## 1. El formulario de login

El login pasa de un botón a un formulario de verdad que envía usuario y contraseña al servidor. Este es el fichero completo; abajo se explica por partes.

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

### Campos controlados

`value` y `onChange` van **en pareja**: lo que se ve en pantalla **es** lo que hay en el estado. Si pones `value` sin `onChange`, el input se queda congelado.

### El envío: `onSubmit` y `preventDefault`

El botón es `type="submit"` y vive dentro de un `<form>`, así que también funciona con **Enter**. Pero un `<form>` es HTML de siempre: al enviarse, **navega** (por defecto con `get`, a la misma url, con los campos en la url). En una SPA eso recarga la aplicación entera y se pierde todo.

```tsx
event.preventDefault(); // cancela el envío del navegador; lo hacemos nosotros con fetch
```

⚠️ Sin el `preventDefault`, la barra de direcciones acabaría mostrando `/login?username=admin&password=test`: **la contraseña a la vista**.

El tipo del evento es `React.SubmitEvent<HTMLFormElement>`. En muchos ejemplos verás `React.FormEvent`, pero está marcado como obsoleto.

### La llamada: `fetch` y `response.ok`

```tsx
const response = await fetch("/api/login", { method: "POST", ... });
const data = await response.json();

if (!response.ok) {
  setError(data.message);
  return;
}
```

⚠️ **Para `fetch`, un `401` no es un error.** Que el servidor conteste ya es un éxito; si la respuesta es buena lo miras tú con `response.ok`. El cuerpo se lee aparte con `response.json()`.

Con credenciales buenas, el servidor devuelve `{ username, name }`. Por eso `onLogin` ahora **lleva un dato** y su tipo cambia a `(user: User) => void`.

### El error y el «estoy esperando»

- **`error`**: el mensaje lo manda el servidor («Usuario o contraseña no válidos»). ⚠️ El `setError("")` del principio es imprescindible: sin él, el error del intento anterior se queda en pantalla.
- **`isPending`**: el servidor tarda casi un segundo. Mientras, el botón se deshabilita y muestra un spinner.
- **`catch`** es «no ha contestado nadie» (sin red, servidor caído), distinto del `!response.ok` («ha contestado que no»).
- ⚠️ **El `finally` no es opcional**: si bajas el `isPending` al final del `try`, el día que algo falle el botón se queda deshabilitado para siempre.

### La tarjeta

`hero` centra en la pantalla, `card` pone la caja con su sombra y `card-body` reparte el contenido. Todo daisyUI, sin CSS propio.

➡️ Fíjate en que el login declara **su propia `interface User`**, igual que la que exportará `session.tsx`. Es una pequeña duplicación que se corrige en `../05-architecture/01-scenes`.

Ya van **cuatro estados** (dos campos, el error y el pendiente), y ninguno tiene que ver con el negocio de la aplicación: es la fontanería de cualquier formulario.

## 2. ¿Quién soy? La sesión

Como la cookie es `httpOnly`, **al arrancar no sabemos si hay sesión**. Hay que preguntarle al servidor con `/api/me`.

_./src/session.tsx_ — **fichero nuevo**

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

Es un **custom hook**: saca de los componentes todo lo que tiene que ver con la sesión.

### ¿Para qué el `isChecking`?

El efecto corre **después** de pintar. Durante ese rato `user` vale `null`… el mismo `null` que cuando no hay sesión. Sin otro dato, `null` significaría dos cosas opuestas:

|                    | Qué significa                             | Qué hay que hacer |
| ------------------ | ----------------------------------------- | ----------------- |
| `isChecking: true` | Todavía estamos preguntando               | **Esperar**       |
| `user: null`       | Ya hemos preguntado: no hay sesión        | Mandar al login   |
| `user: {...}`      | Ya hemos preguntado: hay sesión, de quién | Dejar pasar       |

Esto no es cosa de las cookies: **pasa con todo lo asíncrono**. Cargando, bien y mal. Volverá a salir en el listado.

## 3. Engancharlo en `App.tsx`

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

`onLogin={setUser}`: el login recibe el setter y empuja hacia arriba el usuario que devuelve el servidor. El mismo patrón de antes, pero ahora el aviso lleva un dato.

## 4. El portero aprende a esperar

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

⚠️ **Sin esto, es un fallo silencioso:** la aplicación funciona hasta que alguien refresca en `/characters`, y entonces le echa al login. La sesión sí dura (la cookie sigue ahí); lo que pasa es que no le hemos dado tiempo a contestar.

## 5. Salir de verdad, y saludar al usuario

Cerrar sesión ya no es poner un booleano a `false`: hay que decírselo al servidor para que borre la cookie. Si no, al recargar seguirías dentro.

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

El nombre y el botón se agrupan en un `div` para que vayan juntos a la derecha; la marca, con `flex-1`, ocupa el hueco.

## Pruébalo

```bash
pnpm start
```

1. **Clave mala.** Sale el mensaje del servidor, en rojo, y sigues en el login.
2. **`admin` / `test`.** Entras, y arriba aparece **Rick Sanchez**: ese nombre viene del servidor.
3. **Refresca estando en `/characters`.** Sigues dentro, con un spinner breve mientras `/api/me` contesta.
4. **Mira la cookie.** DevTools → _Application → Cookies_: está `session`, marcada **HttpOnly**. Escribe `document.cookie` en la consola: **sale vacío**.
5. **Salir**, y vuelve a intentar `/characters`: fuera.

⚠️ **Avisos:**

- En la consola verás un **`401` al cargar el login**: es `/api/me` diciendo «no hay sesión». Sale dos veces en desarrollo por `StrictMode`.
- **No hay validación todavía.** Si envías el formulario vacío, la petición sale igual y la rechaza el servidor. Eso es el paso siguiente.
- La cookie **caduca en una hora**: si vuelves más tarde, te pedirá entrar otra vez.

**Siguiente:** `03-login-zod` — validar antes de enviar, con zod.
