# 01 Routing — varias pantallas y una zona privada

**Parte de:** `00-boilerplate`.

Hasta ahora la aplicación era **una sola pantalla**. Vamos a convertirla en tres —login, listado y detalle— y a dejar el listado y el detalle **detrás de un portero**, para que no se pueda entrar sin pasar por el login.

Todavía **no hablamos con el servidor**: el login no comprueba nada y las pantallas son un título y un botón. Este paso va solo de rutas.

## Qué es un router

Una aplicación de React vive en **una sola página** (`index.html`). Para tener varias pantallas sin recargar, es JavaScript quien decide qué pintar según la url: eso es una **SPA** (_single page application_), y lo que lo gestiona es un **router**. Un router es, básicamente, **un mapa: para esta url, pinta este componente**.

## Qué toca este paso

Todos los ficheros sueltos en `src/`, sin carpetas (ordenarlos es justo de lo que va `../05-architecture`):

```
src/
  App.tsx               ← se reescribe: aquí vive el mapa de rutas
  login.tsx             ← nuevo: pantalla de login
  character-list.tsx    ← nuevo: pantalla de listado
  character-detail.tsx  ← nuevo: pantalla de detalle
  private-routes.tsx    ← nuevo: el portero de la zona privada
  app-layout.tsx        ← nuevo: la cabecera común
```

# Pasos

## 1. Instalar React Router

```bash
pnpm add react-router
```

⚠️ **Ojo con el nombre.** Durante años se instalaba `react-router-dom`, y así lo verás en muchos tutoriales. Desde la versión 7 los dos paquetes se unificaron: en proyectos nuevos se instala **`react-router`** y se importa de ahí.

React Router se puede usar de dos maneras: **declarativa** (componentes `<BrowserRouter>`, `<Routes>`, `<Route>` en el JSX, cada pantalla pide sus datos) o como **data router** (`createBrowserRouter` con `loader` y `action` por ruta). Usamos la declarativa: es la más sencilla de leer y la que más vas a encontrar. El mapa de rutas es el mismo en las dos.

## 2. Las pantallas del listado y del detalle

Son deliberadamente sencillas: un título y un enlace. Lo que importa hoy es la navegación.

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

- **`Link`** pinta un `<a>` de verdad, pero intercepta el clic y cambia la url **sin recargar**.
- **`useParams`** lee los parámetros de la url: en `/characters/:id`, el `:id`. Devuelve **siempre texto**; si lo necesitas numérico, `Number(id)`.

⚠️ **No uses `<a href>` para navegar dentro de la aplicación.** Funciona, pero recarga la página entera: se pierde el estado, se vuelve a descargar todo y parpadea.

➡️ Van envueltas en un `<div>` y no en un `<main>` porque el `<main>` lo pondrá el layout (paso 5).

## 3. La pantalla de login y `useNavigate`

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

- **`useNavigate`** navega **desde el código**, cuando la decisión la tomas tú: un login correcto, un guardado, un borrado. `Link` es un enlace que pulsa el usuario; `navigate` es una orden.
- **`onLogin`** es la forma de avisar hacia arriba de que el usuario ha entrado. Quién guarda ese dato lo decide `App` (paso 4).

## 4. El mapa de rutas y la zona privada

### La sesión (de mentira, por ahora)

Todavía no hay servidor de por medio, así que la sesión es **un booleano** en `App`. Vive **por encima de las rutas** para que sobreviva al cambiar de pantalla. En `02-login` lo sustituye la sesión de verdad, con cookie.

### El portero

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

- **`<Outlet />`** significa «aquí va la ruta hija que toque». Es un hueco que rellena el router.
- **`<Navigate replace>`** redirige sustituyendo la url en el historial. Sin `replace`, el botón «atrás» te devuelve a la url prohibida y vuelve a redirigirte: te quedas atrapado.

⚠️ **Esto es comodidad, no seguridad.** Todo corre en el navegador del usuario. Lo que protege los datos de verdad es el servidor.

## 5. El layout: la cabecera común

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

El mismo mecanismo del `<Outlet />`, pero para lo que se repite en todas las pantallas privadas. Al navegar entre listado y detalle, la cabecera **no se vuelve a montar**: solo cambia lo que hay en el hueco.

## 6. `App.tsx`: todo junto

La portada del boilerplate (la demo del compilador) **se sustituye entera**:

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

**Las piezas:**

- **`<BrowserRouter>`** — se pone una vez, envolviéndolo todo. Vigila la url del navegador.
- **`<Routes>`** — el contenedor del mapa. Pinta **solo la ruta que mejor casa**.
- **`<Route path element>`** — una línea del mapa: para esta url, este componente.
- **Rutas sin `path`** (portero y layout) — no representan ninguna url, solo envuelven a sus hijas. Se llaman _layout routes_. Léelo en voz alta: para llegar al listado hay que atravesar el portero y luego el layout.
- **`path="*"`** — el comodín. ⚠️ Sin él, una url mal escrita pinta **una página en blanco** sin ningún error.

**Los datos bajan por props y los avisos suben por funciones.** `App` tiene el estado y le pasa al login una función (`onLogin`) y al layout otra (`onLogout`). Los hijos no tocan el estado del padre: solo le avisan.

⚠️ **Ojo a la flecha:** `onLogin={() => setIsLogged(true)}` pasa una función **sin ejecutar**. Con `onLogin={setIsLogged(true)}` la estarías llamando durante el render: bucle infinito.

## 7. `BrowserRouter` o `HashRouter`

Con `BrowserRouter` las urls son limpias (`/characters`), pero al **refrescar** el navegador le pide esa ruta al servidor. En desarrollo Vite ya lo resuelve; en producción, un servidor de ficheros normal contesta **404**:

```bash
pnpm build
npx serve dist -l 4200      # navega, refresca en /characters → 404
npx serve -s dist -l 4200   # -s: sirve index.html para todo → funciona
```

`HashRouter` pone las rutas detrás de una almohadilla (`/#/characters`). El navegador **nunca manda al servidor lo que va detrás de `#`**, así que funciona sin configurar nada.

|                                    | `BrowserRouter`        | `HashRouter`     |
| ---------------------------------- | ---------------------- | ---------------- |
| **Url**                            | `/characters`          | `/#/characters`  |
| **Hay que configurar el servidor** | Sí (una línea)         | No               |
| **Si no lo configuras**            | 404 al refrescar       | Funciona igual   |

Usa **`BrowserRouter` por defecto** (urls de verdad, que se comparten e indexan). `HashRouter` cuando no puedas tocar el servidor.

## Pruébalo

```bash
pnpm start
```

1. Abre <http://localhost:5173>: caes en `/login`, porque la raíz no casa con ninguna ruta.
2. Escribe `/characters` en la barra: te devuelve al login. El portero funciona.
3. Pulsa **Entrar**: llegas al listado, con la cabecera arriba.
4. Pulsa el enlace: la url pasa a `/characters/2` y el detalle muestra `Id: 2`. **No se recarga** la página.
5. Pulsa **Salir** y vuelve a intentar `/characters`: fuera.

⚠️ **Al refrescar se pierde la sesión.** Es normal: el booleano vive en memoria. Se arregla en el paso siguiente.

**Siguiente:** `02-login` — el login habla con el servidor y la sesión pasa a vivir en una cookie.
