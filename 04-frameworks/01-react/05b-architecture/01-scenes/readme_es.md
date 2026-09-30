# 01 Rutas, layouts y escenas

> **Parte de `../../04b-basic-app/05-detail`**, el código tal y como quedó en clase. No hay boilerplate nuevo: cogemos la aplicación que funciona y la colocamos.

## Qué toca este paso

La aplicación funciona. El problema es **dónde está cada cosa**: trece ficheros sueltos en `src/`, y la respuesta a "¿dónde meto lo siguiente?" es "pues... por ahí".

En este paso:

- el **alias `#`**, para dejar de contar carpetas al importar,
- **`core/router`**: las urls en un sitio y solo en uno,
- **`core/auth`**: la sesión, que la usa toda la aplicación,
- **`layouts`**: lo que envuelve a las pantallas,
- **`scenes`**: las pantallas, con su nombre y su sitio.

```
src/
  core/router/routes.ts                     ← nuevo
  core/router/router.component.tsx          ← nuevo (sale de App.tsx)
  core/router/private-routes.component.tsx  ← se muda (era private-routes.tsx)
  core/router/index.ts                      ← nuevo
  core/auth/auth.vm.ts                      ← nuevo
  core/auth/auth.hook.ts                    ← se muda (era session.tsx)
  core/auth/index.ts                        ← nuevo
  layouts/app.layout.tsx                    ← se muda (era app-layout.tsx)
  layouts/center.layout.tsx                 ← nuevo
  layouts/index.ts                          ← nuevo
  scenes/login.scene.tsx                    ← se muda (era login.tsx)
  scenes/character-list.scene.tsx           ← se muda (era character-list.tsx)
  scenes/character-detail.scene.tsx         ← se muda (era character-detail.tsx)
  scenes/index.ts                           ← nuevo
  App.tsx                                   ← se queda en tres líneas
```

## De dónde partimos

```
App.tsx              app-layout.tsx        character-card.tsx
character-detail.tsx character-list.tsx    character.schema.ts
episode-table.tsx    index.css             login.schema.ts
login.tsx            main.tsx              private-routes.tsx
session.tsx
```

Mira esa lista y responde: ¿cuáles son **pantallas**? ¿Cuáles son **piezas** que usan las pantallas? ¿Cuáles no son ni una cosa ni otra, sino **fontanería** de la aplicación? Las respuestas están en tu cabeza, no en el proyecto. Al acabar este paso, la estructura de carpetas contestará sola.

⚠️ **Nada de lo que viene cambia lo que hace la aplicación.** Al terminar, todo funciona exactamente igual.

# Pasos

## 1. El alias `#`

Antes de mover nada, prepara el terreno. En cuanto anidemos carpetas, los imports serían `../../../character.schema`, y eso se rompe en cuanto mueves un fichero.

Se declara en el `package.json` con una característica estándar de Node, los **subpath imports**:

_./package.json_

```diff
    "type": "module",
+   "imports": {
+     "#*": "./src/*"
+   },
```

Y TypeScript necesita enterarse también, porque no lee esa parte del `package.json` para resolver tipos:

_./tsconfig.app.json_

```diff
    "types": ["vite/client"],
+   "paths": {
+     "#*": ["./src/*"]
+   },
```

A partir de aquí, `#core/router` significa lo mismo **desde cualquier fichero del proyecto**.

⚠️ **Sin barra:** es `#core/router`, no `#/core/router`. El patrón es `"#*"`, así que la almohadilla se pega al nombre de la carpeta.

⚠️ **Hacen falta los dos ficheros:** Vite resuelve los imports al construir (leyendo el `package.json`) y TypeScript al comprobar tipos y autocompletar en el editor. Si falta uno, o la aplicación no arranca o el editor lo pinta todo en rojo. Si el editor no se entera, reinicia el servidor de TypeScript (`TypeScript: Restart TS Server`).

## 2. `core/router`: las urls, en un sitio

Busca `"/characters"` en el proyecto: está en el router, en la tarjeta, en el detalle (cuatro veces, dos de ellas con plantilla)... Y `"/login"` en otros tantos. Una url escrita a mano en más de un sitio es una errata esperando su momento.

_./src/core/router/routes.ts_ — **fichero nuevo**

```ts
export const ROUTES = {
  LOGIN: "/login",
  CHARACTERS: "/characters",
  CHARACTER_DETAIL: "/characters/:id",
};
```

**El portero se muda** y usa la constante:

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

El sufijo `.component.tsx` dice qué tipo de cosa es el fichero. Irás viendo `.hook`, `.vm`, `.layout`, `.scene`...

**El barrel**, que convierte una carpeta en una pieza con puerta de entrada:

_./src/core/router/index.ts_ — **fichero nuevo**

```ts
export * from "./routes";
```

Un barrel (`index.ts`) dice **qué se puede usar de esta carpeta desde fuera**. Quien importe `#core/router` recibe `ROUTES`; que exista `private-routes.component.tsx` es asunto interno de la carpeta.

⚠️ **El router en sí (lo que hoy está en `App.tsx`) llega en el paso 6.** Importa la sesión, los layouts y las escenas, y ninguna de esas carpetas existe todavía. Si lo escribiéramos ahora, estaría todo en rojo hasta el final.

## 3. `core/auth`: la fontanería

La sesión no es una pantalla ni una pieza de una pantalla: la usa **toda** la aplicación (el portero para dejarte pasar, el layout para pintar tu nombre, el login para guardarla). Eso es lo que significa `core`.

```bash
mkdir -p src/core/auth
mv src/session.tsx src/core/auth/auth.hook.ts
```

Y se parte en dos: el modelo por un lado y el hook por otro.

_./src/core/auth/auth.vm.ts_ — **fichero nuevo**

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

_./src/core/auth/index.ts_ — **fichero nuevo**

```ts
export * from "./auth.hook";
export * from "./auth.vm";
```

Tres detalles del nombre:

- **`auth` y no `session`**: es el nombre que usan los proyectos de Lemoncode. Da igual cuál elijas, pero que sea el mismo en todo el equipo.
- **`.vm`** es _view model_: el dato tal y como lo necesita la aplicación, que no tiene por qué coincidir con lo que manda el servidor. Lo verás de cerca en `04-api`.
- **De `.tsx` a `.ts`**: dentro no hay JSX. Es un hook, no un componente.

⚠️ **La lógica no cambia** y la sesión se sigue pasando por props desde el router (lo verás en el paso 6). Eso se resuelve en `02-cross-cutting`.

## 4. `layouts`: lo que envuelve

El layout de la zona privada ya existía; solo se muda y usa `ROUTES`:

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

**Y aparece uno nuevo.** El login empieza con `<main className="hero min-h-screen">`, que significa "centra esto en la pantalla". Eso no es del login: es de cualquier pantalla pública (un registro, un "he olvidado mi contraseña"...).

_./src/layouts/center.layout.tsx_ — **fichero nuevo**

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

_./src/layouts/index.ts_ — **fichero nuevo**

```ts
export * from "./app.layout";
export * from "./center.layout";
```

Un layout es un componente que recibe `children` (o, como el de la app, pinta un `<Outlet />`). Lo que cambia no es el código, sino el criterio: va ahí lo que se repite alrededor de varias pantallas.

## 5. `scenes`: las pantallas

Las tres pantallas, con el nombre que las identifica:

```bash
mkdir -p src/scenes
mv src/login.tsx            src/scenes/login.scene.tsx
mv src/character-list.tsx   src/scenes/character-list.scene.tsx
mv src/character-detail.tsx src/scenes/character-detail.scene.tsx
```

| Antes                 | Ahora                  |
| --------------------- | ---------------------- |
| `LoginPage`           | `LoginScene`           |
| `CharacterListPage`   | `CharacterListScene`   |
| `CharacterDetailPage` | `CharacterDetailScene` |

Renómbralos con **F2** en el editor: así se actualizan también los imports.

**El login** usa el tipo de la sesión (adiós a su copia de `interface User`), las rutas y su layout nuevo:

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

**El listado** solo cambia el import de la tarjeta y el nombre:

_./src/scenes/character-list.scene.tsx_

```diff
  import React from "react";
- import { CharacterCard } from "./character-card";
+ import { CharacterCard } from "#character-card";
  ...
- export const CharacterListPage = () => {
+ export const CharacterListScene = () => {
```

**Los enlaces se construyen con `generatePath`**, la función de React Router que rellena los `:parámetros` de una ruta:

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

¿Por qué no una plantilla? Porque `` `/characters/${id}` `` compila aunque la ruta real sea `/personajes/:id`, y no te enteras hasta que alguien pincha. `generatePath` parte de **la misma constante que usa el router**.

⚠️ **Fíjate en el import del tipo:** la tarjeta saca `Character` **de una escena** (`#scenes/character-list.scene`). Una pieza no debería depender de una pantalla. Se arregla en `03-pods`, cuando la tarjeta y su tipo se muden juntos.

**El detalle**: imports con `#`, el nombre y los cuatro enlaces:

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

**La tabla de episodios** solo cambia el import:

_./src/episode-table.tsx_

```diff
- import type { Episode } from "./character.schema";
+ import type { Episode } from "#character.schema";
```

**Y el barrel de las escenas:**

_./src/scenes/index.ts_ — **fichero nuevo**

```ts
export * from "./character-detail.scene";
export * from "./character-list.scene";
export * from "./login.scene";
```

## 6. El router y `App`

Con `core/auth`, `layouts` y `scenes` en su sitio, ya se puede sacar el router de `App.tsx`.

**El router**, que es lo que hoy vive dentro de `App.tsx`, con las urls cambiadas por constantes y los componentes con el nombre que les dimos en el paso 5. Ahora ya existe todo lo que importa: `#core/auth`, `#layouts` y `#scenes`.

_./src/core/router/router.component.tsx_ — **fichero nuevo**

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

**El barrel** lo enseña hacia fuera:

_./src/core/router/index.ts_

```diff
+ export * from "./router.component";
  export * from "./routes";
```

**Y `App.tsx` se queda así:**

_./src/App.tsx_

```tsx
import { Router } from "#core/router";

const App = () => {
  return <Router />;
};

export default App;
```

`App` ya no sabe qué pantallas tiene la aplicación: si mañana añades una, no se toca.

## Cómo queda

```
src/
├── App.tsx                  ← tres líneas
├── main.tsx
├── index.css
│
├── core/                    ← la fontanería: lo que usa toda la aplicación
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
├── layouts/                 ← lo que envuelve a las pantallas
│   ├── app.layout.tsx
│   ├── center.layout.tsx
│   └── index.ts
│
├── scenes/                  ← las pantallas
│   ├── character-detail.scene.tsx
│   ├── character-list.scene.tsx
│   ├── login.scene.tsx
│   └── index.ts
│
├── character-card.tsx       ← 🚧 todavía sueltos
├── character.schema.ts      ← 🚧
├── episode-table.tsx        ← 🚧
└── login.schema.ts          ← 🚧
```

Los cuatro ficheros de abajo no son un descuido: son **las piezas de cada pantalla**, y su sitio llega en `03-pods`.

## Lo que hemos ganado

|            |                                                          |
| ---------- | -------------------------------------------------------- |
| `#`        | Los imports no dependen de dónde está el fichero         |
| `ROUTES`   | Las urls, en un sitio. Cambiar una es cambiar una línea  |
| `core/`    | Lo que usa toda la aplicación, separado de las pantallas |
| `layouts/` | Lo que se repite alrededor de las pantallas              |
| `scenes/`  | Cada pantalla, con su nombre                             |
| `index.ts` | Cada carpeta decide qué enseña al resto                  |

## Pruébalo

```bash
pnpm install
pnpm start
```

- Login con `admin` / `test`, listado, detalle, Anterior/Siguiente y Salir: todo igual que antes.
- Recarga en `/characters` con la sesión abierta: entras directamente.

**Lo que queda pendiente:** el router saca la sesión y la reparte por props al login, al portero y al layout (**prop drilling**).

**Siguiente:** `02-cross-cutting` — la sesión en un contexto.
