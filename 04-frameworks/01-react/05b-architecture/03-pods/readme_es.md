# 03 Pods — el que consigue los datos y el que los pinta

> **Parte de `02-cross-cutting`.** La sesión ya va por contexto. Quedan cuatro ficheros sueltos en `src/` y tres escenas que lo hacen todo: pedir datos, validar, gestionar la carga y pintar.

## Qué toca este paso

Abre `scenes/login.scene.tsx`: son unas 120 líneas con **tres trabajos distintos** dentro:

1. Lo que teclea el usuario y su validación.
2. Hablar con el servidor, guardar la sesión y navegar.
3. Pintar el formulario.

Si cambia el diseño, tocas este fichero. Si cambia la API, también. Si cambia la validación, también. Y los ficheros sueltos (`character-card.tsx`, `character.schema.ts`, `episode-table.tsx`, `login.schema.ts`) tienen dueño: la tarjeta es del listado, la tabla y el esquema son del detalle, el esquema del login es del login.

La solución es el **pod**: una carpeta por funcionalidad con todo lo suyo dentro.

| Pieza | Qué hace |
| --- | --- |
| **container** | Se conecta a los datos (servidor, contexto) y gestiona sus estados |
| **component** | Recibe props y pinta |
| **components/** | Piezas que solo usa este pod |
| **index.ts** | El barrel: solo sale el container |

Y las escenas se quedan **tontas**: eligen layout y pod.

```
src/
  pods/login/login.component.tsx                              ← nuevo
  pods/login/login.container.tsx                              ← nuevo
  pods/login/login.schema.ts                                  ← se muda
  pods/login/index.ts                                         ← nuevo
  pods/character-list/character-list.component.tsx            ← nuevo
  pods/character-list/character-list.container.tsx            ← nuevo
  pods/character-list/character-list.vm.ts                    ← nuevo
  pods/character-list/components/character-card.component.tsx ← se muda
  pods/character-list/components/index.ts                     ← nuevo
  pods/character-list/index.ts                                ← nuevo
  pods/character-detail/character-detail.component.tsx        ← nuevo
  pods/character-detail/character-detail.container.tsx        ← nuevo
  pods/character-detail/character-detail.schema.ts            ← se muda
  pods/character-detail/components/episode-table.component.tsx← se muda
  pods/character-detail/components/index.ts                   ← nuevo
  pods/character-detail/index.ts                              ← nuevo
  scenes/*.scene.tsx                                          ← se quedan en layout + pod
  common/components/spinner.component.tsx                     ← nuevo (primera promoción)
  common/components/error-message.component.tsx               ← nuevo (primera promoción)
  common/components/index.ts                                  ← nuevo
  pods/character-detail/components/character-detail-error.component.tsx ← nuevo
  core/router/private-routes.component.tsx                    ← usa el spinner de common
```

# Pasos

## 1. La mudanza de piezas

```bash
mkdir -p src/pods/login src/pods/character-list/components src/pods/character-detail/components
mv src/login.schema.ts      src/pods/login/login.schema.ts
mv src/character-card.tsx   src/pods/character-list/components/character-card.component.tsx
mv src/episode-table.tsx    src/pods/character-detail/components/episode-table.component.tsx
mv src/character.schema.ts  src/pods/character-detail/character-detail.schema.ts
```

`character.schema.ts` solo lo usa el detalle, así que se muda a su pod con el nombre del pod. `login.schema.ts` no cambia de contenido.

⚠️ **Desde aquí la app no compila hasta terminar el paso 4.** Las escenas y la tabla siguen importando las rutas viejas (`#login.schema`, `#character-card`, `#character.schema`, `#episode-table`); cada escena se arregla al reescribirla.

⚠️ **Dentro de un pod los imports son relativos** (`./`, `../`). El alias `#` es para cruzar de una carpeta a otra; dentro de casa no hace falta.

## 2. Pod `login`

De los cinco `useState` del login, tres son **del formulario** (`username`, `password`, `fieldErrors`) y dos son **de la petición** (`error`, `isPending`). Cada grupo va a su sitio.

**El component: el formulario y su validación.** No sabe que existe un servidor: cuando los datos son válidos, llama a `onLogin`.

_./src/pods/login/login.component.tsx_ — **fichero nuevo**

```tsx
import React from "react";
import { z } from "zod";
import { loginSchema, type Credentials } from "./login.schema";

type FieldErrors = Partial<Record<keyof Credentials, string[]>>;

interface Props {
  error: string;
  isPending: boolean;
  onLogin: (credentials: Credentials) => void;
}

export const LoginComponent = (props: Props) => {
  const { error, isPending, onLogin } = props;

  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    onLogin(result.data);
  };

  return (
    <div className="card bg-base-100 border-base-300 w-full max-w-sm border shadow-2xl">
      <form className="card-body gap-4" onSubmit={handleSubmit}>
        <h1 className="card-title justify-center text-2xl">Rick &amp; Morty</h1>
        <div>
          <label className="floating-label">
            <span>Usuario</span>
            <input
              className="input aria-invalid:input-error w-full"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              aria-invalid={Boolean(fieldErrors.username)}
            />
          </label>
          {fieldErrors.username && (
            <p className="text-error mt-1 text-sm">{fieldErrors.username[0]}</p>
          )}
        </div>
        <div>
          <label className="floating-label">
            <span>Contraseña</span>
            <input
              className="input aria-invalid:input-error w-full"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
          </label>
          {fieldErrors.password && (
            <p className="text-error mt-1 text-sm">{fieldErrors.password[0]}</p>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isPending ? "Entrando..." : "Entrar"}
        </button>
        <p className="text-sm opacity-60">Prueba con admin / test</p>
      </form>
    </div>
  );
};
```

**El container: la petición, la sesión y la navegación.**

_./src/pods/login/login.container.tsx_ — **fichero nuevo**

```tsx
import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "#core/auth";
import { ROUTES } from "#core/router";
import { LoginComponent } from "./login.component";
import type { Credentials } from "./login.schema";

export const LoginContainer = () => {
  const { setUserSession } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleLogin = async (credentials: Credentials) => {
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setUserSession(data);
      navigate(ROUTES.CHARACTERS);
    } catch {
      setError("No se ha podido conectar con el servidor");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LoginComponent error={error} isPending={isPending} onLogin={handleLogin} />
  );
};
```

Busca `fetch` o `navigate` en el component: no están. Mañana `onLogin` puede ir a otro servidor y el formulario ni se entera.

_./src/pods/login/index.ts_ — **fichero nuevo**

```ts
export * from "./login.container";
```

⚠️ **Del barrel solo sale el container.** Desde fuera el pod es una caja: la pones y funciona. El component es una pieza interna.

**La escena se queda en layout + pod:**

_./src/scenes/login.scene.tsx_ — **se reescribe entero**

```tsx
import { CenterLayout } from "#layouts";
import { LoginContainer } from "#pods/login";

export const LoginScene = () => {
  return (
    <CenterLayout>
      <LoginContainer />
    </CenterLayout>
  );
};
```

## 3. Pod `character-list`

**El tipo se muda a su casa.** La `interface Character` que vivía en la escena del listado pasa a ser el modelo del pod:

_./src/pods/character-list/character-list.vm.ts_ — **fichero nuevo**

```ts
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}
```

Y la tarjeta deja de importar el tipo desde una escena (el olor que dejamos señalado en `01-scenes`):

_./src/pods/character-list/components/character-card.component.tsx_

```diff
  import { Link, generatePath } from "react-router";
  import { ROUTES } from "#core/router";
- import type { Character } from "#scenes/character-list.scene";
+ import type { Character } from "../character-list.vm";
```

_./src/pods/character-list/components/index.ts_ — **fichero nuevo**

```ts
export * from "./character-card.component";
```

**El component pinta la rejilla:**

_./src/pods/character-list/character-list.component.tsx_ — **fichero nuevo**

```tsx
import { CharacterCard } from "./components";
import type { Character } from "./character-list.vm";

interface Props {
  characters: Character[];
}

export const CharacterListComponent = (props: Props) => {
  const { characters } = props;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};
```

**El container pide los datos y gestiona sus estados.** Es el cuerpo de la escena de antes; además del nombre y los imports, lo importante que cambia es el último `return`:

_./src/pods/character-list/character-list.container.tsx_ — **fichero nuevo**

```tsx
import React from "react";
import { CharacterListComponent } from "./character-list.component";
import type { Character } from "./character-list.vm";

export const CharacterListContainer = () => {
  const [characters, setCharacters] = React.useState<Character[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("/api/characters")
      .then((response) => {
        if (!response.ok) {
          throw new Error("El servidor ha contestado con un error");
        }

        return response.json();
      })
      .then((data) => setCharacters(data.results))
      .catch(() => setError("No se han podido cargar los personajes"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return <CharacterListComponent characters={characters} />;
};
```

**Qué** pintar mientras cargan o si fallan lo decide el container, porque son **estados de los datos** (todavía no han llegado, o han fallado). El component solo sabe pintar personajes que ya existen. El **cómo** (el markup del spinner y del error) lo sacamos del container en el paso 5.

_./src/pods/character-list/index.ts_ — **fichero nuevo**

```ts
export * from "./character-list.container";
```

_./src/scenes/character-list.scene.tsx_ — **se reescribe entero**

```tsx
import { CharacterListContainer } from "#pods/character-list";

export const CharacterListScene = () => {
  return <CharacterListContainer />;
};
```

## 4. Pod `character-detail`

Igual que el listado, con una diferencia: **¿quién lee el `id` de la url?** La escena. El pod recibe un `id` por props y no sabe si viene de la url, de un modal o de un test.

Se construye de dentro hacia fuera, para que cada import nuevo apunte a algo que ya existe. Primero la tabla, que solo cambia el import del tipo:

_./src/pods/character-detail/components/episode-table.component.tsx_

```diff
- import type { Episode } from "#character.schema";
+ import type { Episode } from "../character-detail.schema";
```

_./src/pods/character-detail/components/index.ts_ — **fichero nuevo**

```ts
export * from "./episode-table.component";
```

**El component:** la ficha que antes pintaba la escena (volver, Anterior/Siguiente, tarjeta y tabla), ahora recibiendo `character` por props:

_./src/pods/character-detail/character-detail.component.tsx_ — **fichero nuevo**

```tsx
import { Link, generatePath } from "react-router";
import { ROUTES } from "#core/router";
import type { CharacterDetail } from "./character-detail.schema";
import { EpisodeTable } from "./components";

interface Props {
  character: CharacterDetail;
}

export const CharacterDetailComponent = (props: Props) => {
  const { character } = props;

  return (
    <div className="flex flex-col gap-6">
      <Link className="btn btn-ghost w-fit" to={ROUTES.CHARACTERS}>
        ← Volver al listado
      </Link>

      <div className="join">
        {character.id > 1 && (
          <Link
            className="btn join-item"
            to={generatePath(ROUTES.CHARACTER_DETAIL, {
              id: String(character.id - 1),
            })}
          >
            Anterior
          </Link>
        )}

        <Link
          className="btn join-item"
          to={generatePath(ROUTES.CHARACTER_DETAIL, {
            id: String(character.id + 1),
          })}
        >
          Siguiente
        </Link>
      </div>

      <div className="card bg-base-100 border-base-300 sm:card-side border">
        <figure className="sm:w-64 sm:shrink-0">
          <img
            className="h-full w-full object-cover"
            src={character.image}
            alt={character.name}
          />
        </figure>

        <div className="card-body gap-4">
          <h2 className="card-title text-3xl">{character.name}</h2>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-lg badge-primary">
              {character.species}
            </span>
            <span className="badge badge-lg badge-ghost">
              {character.gender}
            </span>
            <span className="badge badge-lg badge-ghost">
              {character.status}
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm opacity-60">Origen</dt>
              <dd className="font-semibold">{character.origin}</dd>
            </div>

            <div>
              <dt className="text-sm opacity-60">Última ubicación</dt>
              <dd className="font-semibold">{character.location}</dd>
            </div>

            <div>
              <dt className="text-sm opacity-60">Episodios</dt>
              <dd className="font-semibold">{character.episodeCount}</dd>
            </div>
          </dl>
        </div>
      </div>
      <EpisodeTable episodes={character.episodes} />
    </div>
  );
};
```

**El container:** el cuerpo de la escena de antes, con el `id` por props y el `return` final delegando en el component:

_./src/pods/character-detail/character-detail.container.tsx_ — **fichero nuevo**

```tsx
import React from "react";
import { Link } from "react-router";
import { z } from "zod";
import { ROUTES } from "#core/router";
import { CharacterDetailComponent } from "./character-detail.component";
import {
  characterDetailSchema,
  type CharacterDetail,
} from "./character-detail.schema";

interface Props {
  id: string;
}

export const CharacterDetailContainer = (props: Props) => {
  const { id } = props;
  const [character, setCharacter] = React.useState<CharacterDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadCharacter = () => {
      setIsLoading(true);
      setError("");

      fetch(`/api/characters/${id}`)
        .then((response) => {
          if (response.status === 404) {
            throw new Error("Ese personaje no existe");
          }
          if (!response.ok) {
            throw new Error("El servidor ha contestado con un error");
          }

          return response.json();
        })
        .then((data) => {
          const result = characterDetailSchema.safeParse(data);

          if (!result.success) {
            console.error("La API ha cambiado:", z.treeifyError(result.error));
            setError("La respuesta del servidor no tiene el formato esperado");
            return;
          }

          setCharacter(result.data);
        })
        .catch((error: Error) => setError(error.message))
        .finally(() => setIsLoading(false));
    };

    loadCharacter();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>

        <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return <CharacterDetailComponent character={character} />;
};
```

_./src/pods/character-detail/index.ts_ — **fichero nuevo**

```ts
export * from "./character-detail.container";
```

**Y por último la escena**, que es la que lee el `id` de la url y ya tiene un pod que importar:

_./src/scenes/character-detail.scene.tsx_ — **se reescribe entero**

```tsx
import { useParams } from "react-router";
import { CharacterDetailContainer } from "#pods/character-detail";

export const CharacterDetailScene = () => {
  const { id } = useParams<{ id: string }>();

  return <CharacterDetailContainer id={id ?? ""} />;
};
```

## 5. La primera promoción: spinner y error a `common`

Mira dónde está ahora el spinner: en el portero (`core/router/private-routes.component.tsx`), en el container del listado y en el del detalle. El error, en los dos containers. **Tres copias**, y además es markup con clases de daisyUI metido en containers, que deberían decidir **qué** se pinta, no **cómo** se ve.

No son de ningún pod ni saben nada de personajes, así que suben a `common`: lo **sin dominio**, promocionable a librería. Es la primera vez que aplicamos el principio de promoción: **pod → common → librería**.

_./src/common/components/spinner.component.tsx_ — **fichero nuevo**

```tsx
export const Spinner = () => {
  return (
    <div className="flex justify-center p-10">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};
```

_./src/common/components/error-message.component.tsx_ — **fichero nuevo**

```tsx
interface Props {
  message: string;
}

export const ErrorMessage = (props: Props) => {
  const { message } = props;

  return (
    <div role="alert" className="alert alert-error">
      <span>{message}</span>
    </div>
  );
};
```

_./src/common/components/index.ts_ — **fichero nuevo**

```ts
export * from "./error-message.component";
export * from "./spinner.component";
```

**El listado:** el container se queda solo con la decisión.

_./src/pods/character-list/character-list.container.tsx_

```diff
  import React from "react";
+ import { ErrorMessage, Spinner } from "#common/components";
  import { CharacterListComponent } from "./character-list.component";
  ...
  if (isLoading) {
-   return (
-     <div className="flex justify-center p-10">
-       <span className="loading loading-spinner loading-lg" />
-     </div>
-   );
+   return <Spinner />;
  }

  if (error) {
-   return (
-     <div className="alert alert-error">
-       <span>{error}</span>
-     </div>
-   );
+   return <ErrorMessage message={error} />;
  }
```

**El detalle:** su error lleva además el botón de volver al listado. Ese botón sí es del pod (sabe que existe un listado), así que la pieza va a `components/` del detalle y por dentro usa el `ErrorMessage` de `common`:

_./src/pods/character-detail/components/character-detail-error.component.tsx_ — **fichero nuevo**

```tsx
import { Link } from "react-router";
import { ErrorMessage } from "#common/components";
import { ROUTES } from "#core/router";

interface Props {
  message: string;
}

export const CharacterDetailError = (props: Props) => {
  const { message } = props;

  return (
    <div className="flex flex-col items-start gap-4">
      <ErrorMessage message={message} />

      <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
        Volver al listado
      </Link>
    </div>
  );
};
```

Se exporta en el barrel de `components/` del pod, junto a la tabla de episodios:

_./src/pods/character-detail/components/index.ts_

```diff
+ export * from "./character-detail-error.component";
  export * from "./episode-table.component";
```

**Y ahora el container lo usa** en el `if (error)`, que pasa a ser una sola línea. `Link` y `ROUTES` salen del container porque ahora viven en `CharacterDetailError`, y el spinner es el de `common`, como en el listado:

_./src/pods/character-detail/character-detail.container.tsx_

```diff
  import React from "react";
- import { Link } from "react-router";
  import { z } from "zod";
- import { ROUTES } from "#core/router";
+ import { Spinner } from "#common/components";
  import { CharacterDetailComponent } from "./character-detail.component";
  import {
    characterDetailSchema,
    type CharacterDetail,
  } from "./character-detail.schema";
+ import { CharacterDetailError } from "./components";
  ...
  if (isLoading) {
-   return (
-     <div className="flex justify-center p-10">
-       <span className="loading loading-spinner loading-lg" />
-     </div>
-   );
+   return <Spinner />;
  }

  if (error) {
-   return (
-     <div className="flex flex-col items-start gap-4">
-       <div role="alert" className="alert alert-error">
-         <span>{error}</span>
-       </div>
-
-       <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
-         Volver al listado
-       </Link>
-     </div>
-   );
+   return <CharacterDetailError message={error} />;
  }
```

**El portero:** el mismo spinner, pero en mitad de la pantalla. Para centrar ya tenemos `CenterLayout`:

_./src/core/router/private-routes.component.tsx_

```diff
  import { Navigate, Outlet } from "react-router";
+ import { Spinner } from "#common/components";
  import { useAuth } from "#core/auth";
+ import { CenterLayout } from "#layouts";
  import { ROUTES } from "./routes";
  ...
  if (isChecking) {
    return (
-     <div className="flex min-h-screen items-center justify-center">
-       <span className="loading loading-spinner loading-lg"></span>
-     </div>
+     <CenterLayout>
+       <Spinner />
+     </CenterLayout>
    );
  }
```

**Por qué:** el container decide qué se pinta según el estado de los datos (cargando, error o datos), y cómo se ve cada caso es cosa de componentes que solo pintan. Es la regla del patrón container/presentational: el container no lleva estilos.

## Cómo queda

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── common/
│   └── components/        ← spinner y error: la primera promoción
├── core/
│   ├── auth/
│   └── router/
├── layouts/
├── pods/
│   ├── login/
│   │   ├── index.ts
│   │   ├── login.component.tsx
│   │   ├── login.container.tsx
│   │   └── login.schema.ts
│   ├── character-list/
│   │   ├── components/
│   │   │   ├── character-card.component.tsx
│   │   │   └── index.ts
│   │   ├── character-list.component.tsx
│   │   ├── character-list.container.tsx
│   │   ├── character-list.vm.ts
│   │   └── index.ts
│   └── character-detail/
│       ├── components/
│       │   ├── character-detail-error.component.tsx
│       │   ├── episode-table.component.tsx
│       │   └── index.ts
│       ├── character-detail.component.tsx
│       ├── character-detail.container.tsx
│       ├── character-detail.schema.ts
│       └── index.ts
└── scenes/                  ← tontas: layout + pod
    ├── character-detail.scene.tsx
    ├── character-list.scene.tsx
    ├── login.scene.tsx
    └── index.ts
```

**Ni un fichero suelto:** cada cosa tiene su sitio y el sitio dice lo que es.

## Lo que hemos ganado

| | |
| --- | --- |
| Pods | Todo lo de una funcionalidad, junto |
| Container | Datos y sus estados, en un solo sitio; decide qué pintar, pero no lleva estilos |
| Component | Pinta con props: se entiende y se prueba sin servidor |
| `components/` | Piezas con dueño; si otro pod las necesita, se promocionan a `common` |
| `common/` | El spinner y el error de carga, escritos una sola vez |
| Escenas tontas | Solo eligen layout y pod |

## Pruébalo

```bash
pnpm install
pnpm start
```

- Login: envía con la contraseña corta (error de campo), corrígela y envía con una contraseña mala (el error de campo desaparece y sale el del servidor). Luego `admin` / `test`.
- Listado, detalle, Anterior/Siguiente.
- `/characters/99999`: "Ese personaje no existe".

**Lo que queda pendiente:** abre cualquier container. Sigue sabiendo la url del servidor, la forma del JSON y cómo validarlo. Sabe demasiado.

**Siguiente:** `04-api` — api, api model, view model y mapper.
