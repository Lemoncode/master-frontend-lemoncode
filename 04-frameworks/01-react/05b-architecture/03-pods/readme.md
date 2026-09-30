# 03 Pods — who gets the data and who renders it

> **Starts from `02-cross-cutting`.** The session already lives in a context. Four files are still loose in `src/` and three scenes do everything: fetch data, validate, handle loading and render.

## What this step covers

Open `scenes/login.scene.tsx`: about 120 lines with **three different jobs** inside:

1. What the user types and its validation.
2. Talking to the server, storing the session and navigating.
3. Rendering the form.

If the design changes, you touch this file. If the API changes, too. If validation changes, too. And the loose files (`character-card.tsx`, `character.schema.ts`, `episode-table.tsx`, `login.schema.ts`) have an owner: the card belongs to the list, the table and schema to the detail, the login schema to the login.

The solution is the **pod**: one folder per feature with everything it needs inside.

| Piece | What it does |
| --- | --- |
| **container** | Binds to the data (server, context) and handles its states |
| **component** | Receives props and renders |
| **components/** | Pieces used only by this pod |
| **index.ts** | The barrel: only the container is exported |

And scenes become **dumb**: they pick a layout and a pod.

```
src/
  pods/login/login.component.tsx                              ← new
  pods/login/login.container.tsx                              ← new
  pods/login/login.schema.ts                                  ← moved
  pods/login/index.ts                                         ← new
  pods/character-list/character-list.component.tsx            ← new
  pods/character-list/character-list.container.tsx            ← new
  pods/character-list/character-list.vm.ts                    ← new
  pods/character-list/components/character-card.component.tsx ← moved
  pods/character-list/components/index.ts                     ← new
  pods/character-list/index.ts                                ← new
  pods/character-detail/character-detail.component.tsx        ← new
  pods/character-detail/character-detail.container.tsx        ← new
  pods/character-detail/character-detail.schema.ts            ← moved
  pods/character-detail/components/episode-table.component.tsx← moved
  pods/character-detail/components/index.ts                   ← new
  pods/character-detail/index.ts                              ← new
  scenes/*.scene.tsx                                          ← down to layout + pod
  common/components/spinner.component.tsx                     ← new (first promotion)
  common/components/error-message.component.tsx               ← new (first promotion)
  common/components/index.ts                                  ← new
  pods/character-detail/components/character-detail-error.component.tsx ← new
  core/router/private-routes.component.tsx                    ← uses the spinner from common
```

# Steps

## 1. Moving the pieces

```bash
mkdir -p src/pods/login src/pods/character-list/components src/pods/character-detail/components
mv src/login.schema.ts      src/pods/login/login.schema.ts
mv src/character-card.tsx   src/pods/character-list/components/character-card.component.tsx
mv src/episode-table.tsx    src/pods/character-detail/components/episode-table.component.tsx
mv src/character.schema.ts  src/pods/character-detail/character-detail.schema.ts
```

`character.schema.ts` is only used by the detail, so it moves into that pod with the pod's name. `login.schema.ts` keeps its content.

⚠️ **From here on the app doesn't compile until the end of step 4.** The scenes and the table still import the old paths (`#login.schema`, `#character-card`, `#character.schema`, `#episode-table`); each scene gets fixed when it's rewritten.

⚠️ **Inside a pod, imports are relative** (`./`, `../`). The `#` alias is for crossing from one folder to another; you don't need it inside your own house.

## 2. `login` pod

Of the login's five `useState`, three belong to **the form** (`username`, `password`, `fieldErrors`) and two to **the request** (`error`, `isPending`). Each group goes to its place.

**The component: the form and its validation.** It doesn't know a server exists: when the data is valid, it calls `onLogin`.

_./src/pods/login/login.component.tsx_ — **new file**

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

**The container: the request, the session and navigation.**

_./src/pods/login/login.container.tsx_ — **new file**

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

Search the component for `fetch` or `navigate`: they're not there. Tomorrow `onLogin` could go to another server and the form wouldn't notice.

_./src/pods/login/index.ts_ — **new file**

```ts
export * from "./login.container";
```

⚠️ **Only the container leaves the barrel.** From outside, the pod is a box: you drop it in and it works. The component is an internal piece.

**The scene is down to layout + pod:**

_./src/scenes/login.scene.tsx_ — **rewritten**

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

## 3. `character-list` pod

**The type moves home.** The `interface Character` that lived in the list scene becomes the pod's model:

_./src/pods/character-list/character-list.vm.ts_ — **new file**

```ts
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}
```

And the card stops importing the type from a scene (the smell we flagged in `01-scenes`):

_./src/pods/character-list/components/character-card.component.tsx_

```diff
  import { Link, generatePath } from "react-router";
  import { ROUTES } from "#core/router";
- import type { Character } from "#scenes/character-list.scene";
+ import type { Character } from "../character-list.vm";
```

_./src/pods/character-list/components/index.ts_ — **new file**

```ts
export * from "./character-card.component";
```

**The component renders the grid:**

_./src/pods/character-list/character-list.component.tsx_ — **new file**

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

**The container fetches the data and handles its states.** It's the body of the old scene; besides the name and the imports, the important change is the last `return`:

_./src/pods/character-list/character-list.container.tsx_ — **new file**

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

**What** to render while loading or on failure is decided by the container, because they're **data states** (not arrived yet, or failed). The component only knows how to render characters that already exist. The **how** (the spinner and error markup) gets moved out of the container in step 5.

_./src/pods/character-list/index.ts_ — **new file**

```ts
export * from "./character-list.container";
```

_./src/scenes/character-list.scene.tsx_ — **rewritten**

```tsx
import { CharacterListContainer } from "#pods/character-list";

export const CharacterListScene = () => {
  return <CharacterListContainer />;
};
```

## 4. `character-detail` pod

Same as the list, with one difference: **who reads the `id` from the url?** The scene. The pod receives an `id` through props and doesn't know whether it comes from the url, a modal or a test.

Build it from the inside out, so every new import points to something that already exists. First the table, which only changes the type import:

_./src/pods/character-detail/components/episode-table.component.tsx_

```diff
- import type { Episode } from "#character.schema";
+ import type { Episode } from "../character-detail.schema";
```

_./src/pods/character-detail/components/index.ts_ — **new file**

```ts
export * from "./episode-table.component";
```

**The component:** the card the scene used to render (back link, `Anterior`/`Siguiente`, card and table), now receiving `character` through props:

_./src/pods/character-detail/character-detail.component.tsx_ — **new file**

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

**The container:** the body of the old scene, with `id` from props and the last `return` delegating to the component:

_./src/pods/character-detail/character-detail.container.tsx_ — **new file**

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

_./src/pods/character-detail/index.ts_ — **new file**

```ts
export * from "./character-detail.container";
```

**And finally the scene**, which reads the `id` from the url and now has a pod to import:

_./src/scenes/character-detail.scene.tsx_ — **rewritten**

```tsx
import { useParams } from "react-router";
import { CharacterDetailContainer } from "#pods/character-detail";

export const CharacterDetailScene = () => {
  const { id } = useParams<{ id: string }>();

  return <CharacterDetailContainer id={id ?? ""} />;
};
```

## 5. The first promotion: spinner and error to `common`

Look where the spinner is now: in the gatekeeper (`core/router/private-routes.component.tsx`), in the list container and in the detail container. The error, in both containers. **Three copies**, and on top of that it's markup with daisyUI classes inside containers, which should decide **what** gets rendered, not **how** it looks.

They don't belong to any pod and know nothing about characters, so they move up to `common`: the **domain-free** stuff that could become a library. It's the first time we apply the promotion principle: **pod → common → library**.

_./src/common/components/spinner.component.tsx_ — **new file**

```tsx
export const Spinner = () => {
  return (
    <div className="flex justify-center p-10">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};
```

_./src/common/components/error-message.component.tsx_ — **new file**

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

_./src/common/components/index.ts_ — **new file**

```ts
export * from "./error-message.component";
export * from "./spinner.component";
```

**The list:** the container keeps only the decision.

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

**The detail:** its error also has the button back to the list. That button does belong to the pod (it knows there's a list), so the piece goes into the detail's `components/` and uses `common`'s `ErrorMessage` inside:

_./src/pods/character-detail/components/character-detail-error.component.tsx_ — **new file**

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

It's exported from the pod's `components/` barrel, next to the episode table:

_./src/pods/character-detail/components/index.ts_

```diff
+ export * from "./character-detail-error.component";
  export * from "./episode-table.component";
```

**And now the container uses it** in the `if (error)`, which becomes a single line. `Link` and `ROUTES` leave the container because they now live in `CharacterDetailError`, and the spinner is the one from `common`, as in the list:

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

**The gatekeeper:** the same spinner, but in the middle of the screen. We already have `CenterLayout` for centring:

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

**Why:** the container decides what to render based on the data state (loading, error or data), and how each case looks is up to components that only render. That's the container/presentational rule: the container has no styles.

## Result

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── common/
│   └── components/        ← spinner and error: the first promotion
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
└── scenes/                  ← dumb: layout + pod
    ├── character-detail.scene.tsx
    ├── character-list.scene.tsx
    ├── login.scene.tsx
    └── index.ts
```

**Not a single loose file:** everything has its place and the place says what it is.

## What we gained

| | |
| --- | --- |
| Pods | Everything about a feature, together |
| Container | Data and its states, in one place; decides what to render, but has no styles |
| Component | Renders from props: easy to read and test without a server |
| `components/` | Pieces with an owner; if another pod needs them, they get promoted to `common` |
| `common/` | The loading spinner and error, written only once |
| Dumb scenes | They only pick a layout and a pod |

## Try it

```bash
pnpm install
pnpm start
```

- Login: submit with a short password (field error), fix it and submit a wrong password (the field error goes away and the server error shows). Then `admin` / `test`.
- List, detail, `Anterior`/`Siguiente` (Previous/Next).
- `/characters/99999`: "Ese personaje no existe".

**Still pending:** open any container. It still knows the server url, the JSON shape and how to validate it. It knows too much.

**Next:** `04-api` — api, api model, view model and mapper.
