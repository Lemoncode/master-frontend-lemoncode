# 04 API — boundaries: api model, view model and mapper

> **Starts from `03-pods`.** Each screen is a pod with a container and a component, but the container still knows too much. And the list **still doesn't validate with zod** (left pending in class: we fix it here).

## What this step covers

Open `pods/character-detail/character-detail.container.tsx` and look at everything it knows:

1. The url: `` `/api/characters/${id}` ``.
2. HTTP codes: `404`, `!response.ok`.
3. The zod schema and the `safeParse`.
4. The states: `character`, `isLoading`, `error`.

Only the last one is the container's job: having the data ready for the screen. The rest is **talking to the server**, and it goes somewhere else.

The key idea is to separate two models:

| Model | What it is | Where |
| --- | --- | --- |
| **api model** | What the server sends (the contract) | `api/*.api-model.ts`, with zod |
| **view model** | What the screen needs | `*.vm.ts` |

And between them, the **mapper**, acting as customs. If the server changes tomorrow, you touch the api model and the mapper; the screen doesn't notice.

```
src/
  common/helpers/validate-response.ts                     ← new (promotion)
  common/helpers/index.ts                                 ← new
  core/auth/auth.api.ts                                   ← new
  core/auth/auth.provider.tsx                             ← uses the api
  pods/login/api/login.api.ts                             ← new
  pods/login/api/index.ts                                 ← new
  pods/login/login.container.tsx                          ← uses the api
  pods/character-list/api/character-list.api-model.ts     ← new
  pods/character-list/api/character-list.api.ts           ← new
  pods/character-list/api/index.ts                        ← new
  pods/character-list/character-list.mapper.ts            ← new
  pods/character-list/character-list.vm.ts               ← typed status
  pods/character-list/character-list.container.tsx        ← uses api + mapper
  pods/character-detail/api/character-detail.api-model.ts ← new (was character-detail.schema.ts)
  pods/character-detail/api/character-detail.api.ts       ← new
  pods/character-detail/api/index.ts                      ← new
  pods/character-detail/character-detail.vm.ts            ← new
  pods/character-detail/character-detail.mapper.ts        ← new
  pods/character-detail/character-detail.container.tsx    ← uses api + mapper
  pods/character-detail/character-detail.component.tsx    ← vm type
  pods/character-detail/components/episode-table.component.tsx ← vm fields
```

# Steps

## 1. The detail api

**The contract.** What used to be `character-detail.schema.ts` is now named for what it is: the api model.

```bash
mkdir -p src/pods/character-detail/api
```

_./src/pods/character-detail/api/character-detail.api-model.ts_ — **new file**

```ts
import { z } from "zod";

export const episodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode: z.string(),
  airDate: z.string(),
});

export const characterDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  gender: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
  episodes: z.array(episodeSchema),
});

export type EpisodeApiModel = z.infer<typeof episodeSchema>;
export type CharacterDetailApiModel = z.infer<typeof characterDetailSchema>;
```

⚠️ **The detail doesn't `.extend` the list's api model.** Each pod has its own contract. A few fields are repeated, but in exchange pods are **independent**: you can delete the whole list and the detail won't notice.

**The call:**

_./src/pods/character-detail/api/character-detail.api.ts_ — **new file**

```ts
import { z } from "zod";
import {
  characterDetailSchema,
  type CharacterDetailApiModel,
} from "./character-detail.api-model";

export const getCharacter = async (
  id: string,
): Promise<CharacterDetailApiModel> => {
  const response = await fetch(`/api/characters/${id}`);

  if (response.status === 404) {
    throw new Error("Ese personaje no existe");
  }
  if (!response.ok) {
    throw new Error("El servidor ha contestado con un error");
  }

  const result = characterDetailSchema.safeParse(await response.json());

  if (!result.success) {
    console.error("La API ha cambiado:", z.treeifyError(result.error));
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }

  return result.data;
};
```

Inside the api we use `async/await` because it reads top to bottom: request, check, validate, return.

The zod validation is the same one the container had, with one difference: it **throws an error** instead of calling `setError`, because the api knows nothing about React state. The container catches it in its `.catch`. We don't extract it into a function yet: in step 3 the list will need the same thing and in step 4 it gets promoted.

_./src/pods/character-detail/api/index.ts_ — **new file**

```ts
export * from "./character-detail.api";
export * from "./character-detail.api-model";
```

## 2. Detail view model and mapper

In the table we rendered `episode.episode`... which is the episode code (`S01E01`). **The server chose that name, not us.** The view model uses names that make sense for the screen:

_./src/pods/character-detail/character-detail.vm.ts_ — **new file**

```ts
export interface Episode {
  id: number;
  code: string;
  title: string;
  airDate: string;
}

export interface CharacterDetail {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: string;
  location: string;
  episodeCount: number;
  episodes: Episode[];
}
```

_./src/pods/character-detail/character-detail.mapper.ts_ — **new file**

```ts
import type * as apiModel from "./api";
import type * as viewModel from "./character-detail.vm";

const mapEpisodeFromApiToVm = (
  episode: apiModel.EpisodeApiModel,
): viewModel.Episode => ({
  id: episode.id,
  code: episode.episode,
  title: episode.name,
  airDate: episode.airDate,
});

export const mapCharacterDetailFromApiToVm = (
  character: apiModel.CharacterDetailApiModel,
): viewModel.CharacterDetail => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  gender: character.gender,
  image: character.image,
  origin: character.origin,
  location: character.location,
  episodeCount: character.episodeCount,
  episodes: character.episodes
    ? character.episodes.map(mapEpisodeFromApiToVm)
    : [],
});
```

- **`import type * as apiModel` / `viewModel`:** when reading the mapper, the prefix tells you which side of the boundary each type is on.
- **Isn't copying field by field extra work?** Today both models look very similar. The day the server renames `airDate` to `air_date`, you change **one line in the mapper** and no component.
- **The guard on `episodes`:** if the episodes array arrives as `null` or `undefined`, `character.episodes.map(...)` throws and the whole screen crashes. With the guard, the view model gets an empty array and the table just renders with no rows. Today zod already requires an array, but the mapper is the customs office and shouldn't rely on that: if tomorrow the schema marks it as optional, or someone calls the mapper with unvalidated data, the app doesn't crash.
- **What about `mapEpisodeFromApiToVm`?** It has no guard because it isn't exported: it's only used inside `mapCharacterDetailFromApiToVm`, and `.map` only passes it episodes that exist. If you exported it and used it from outside, you'd also have to check that `episode` isn't `null` or `undefined` before reading its fields.

**The table uses the view model names:**

_./src/pods/character-detail/components/episode-table.component.tsx_

```diff
- import type { Episode } from "../character-detail.schema";
+ import type { Episode } from "../character-detail.vm";
  ...
                  <tr key={episode.id}>
-                   <td className="font-mono">{episode.episode}</td>
-                   <td>{episode.name}</td>
+                   <td className="font-mono">{episode.code}</td>
+                   <td>{episode.title}</td>
                    <td className="opacity-60">{episode.airDate}</td>
```

_./src/pods/character-detail/character-detail.component.tsx_

```diff
- import type { CharacterDetail } from "./character-detail.schema";
+ import type { CharacterDetail } from "./character-detail.vm";
```

**And the container slims down:** it asks for a character, translates it and stores it.

_./src/pods/character-detail/character-detail.container.tsx_

```diff
  import React from "react";
- import { z } from "zod";
  import { Spinner } from "#common/components";
+ import { getCharacter } from "./api";
  import { CharacterDetailComponent } from "./character-detail.component";
- import {
-   characterDetailSchema,
-   type CharacterDetail,
- } from "./character-detail.schema";
+ import { mapCharacterDetailFromApiToVm } from "./character-detail.mapper";
+ import type { CharacterDetail } from "./character-detail.vm";
  import { CharacterDetailError } from "./components";
  ...
        setIsLoading(true);
        setError("");

-       fetch(`/api/characters/${id}`)
-         .then((response) => {
-           if (response.status === 404) {
-             throw new Error("Ese personaje no existe");
-           }
-           if (!response.ok) {
-             throw new Error("El servidor ha contestado con un error");
-           }
-
-           return response.json();
-         })
-         .then((data) => {
-           const result = characterDetailSchema.safeParse(data);
-
-           if (!result.success) {
-             console.error("La API ha cambiado:", z.treeifyError(result.error));
-             setError("La respuesta del servidor no tiene el formato esperado");
-             return;
-           }
-
-           setCharacter(result.data);
-         })
+       getCharacter(id)
+         .then((character) =>
+           setCharacter(mapCharacterDetailFromApiToVm(character)),
+         )
          .catch((error: Error) => setError(error.message))
          .finally(() => setIsLoading(false));
```

Nobody imports the old schema anymore, so it can go. Delete it earlier and the container, the component and the table are left with broken imports halfway through the step.

```bash
rm src/pods/character-detail/character-detail.schema.ts
```

## 3. The list: finally with zod

Same pattern. The contract for the characters page:

```bash
mkdir -p src/pods/character-list/api
```

_./src/pods/character-list/api/character-list.api-model.ts_ — **new file**

```ts
import { z } from "zod";

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  gender: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
});

export const characterPageSchema = z.object({
  info: z.object({
    pages: z.number(),
    count: z.number(),
  }),
  results: z.array(characterSchema),
});

export type CharacterApiModel = z.infer<typeof characterSchema>;
export type CharacterPageApiModel = z.infer<typeof characterPageSchema>;
```

_./src/pods/character-list/api/character-list.api.ts_ — **new file**

```ts
import { z } from "zod";
import {
  characterPageSchema,
  type CharacterPageApiModel,
} from "./character-list.api-model";

export const getCharacterPage = async (): Promise<CharacterPageApiModel> => {
  const response = await fetch("/api/characters");

  if (!response.ok) {
    throw new Error("No se han podido cargar los personajes");
  }

  const result = characterPageSchema.safeParse(await response.json());

  if (!result.success) {
    console.error("La API ha cambiado:", z.treeifyError(result.error));
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }

  return result.data;
};
```

_./src/pods/character-list/api/index.ts_ — **new file**

```ts
export * from "./character-list.api";
export * from "./character-list.api-model";
```

**The view model gets a real type for the status:**

_./src/pods/character-list/character-list.vm.ts_

```diff
+ export type CharacterStatus = "Alive" | "Dead" | "unknown";
+
  export interface Character {
    id: number;
    name: string;
-   status: string;
+   status: CharacterStatus;
    species: string;
    image: string;
  }
```

With that, the card's `Record<Character["status"], string>` of colours is properly typed again: if a new status appears, TypeScript forces you to give it a colour.

This is where the difference between models shows: the server sends **nine fields** plus pagination; the card uses **five**, and the view model has five. The rest stays at customs.

_./src/pods/character-list/character-list.mapper.ts_ — **new file**

```ts
import type * as apiModel from "./api";
import type * as viewModel from "./character-list.vm";

const mapCharacterFromApiToVm = (
  character: apiModel.CharacterApiModel,
): viewModel.Character => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  image: character.image,
});

export const mapCharacterListFromApiToVm = (
  characterPage: apiModel.CharacterPageApiModel,
): viewModel.Character[] =>
  characterPage.results
    ? characterPage.results.map(mapCharacterFromApiToVm)
    : [];
```

- **The same guard as in the detail:** if `results` arrives as `null` or `undefined`, the list renders empty instead of crashing the screen.
- **`mapCharacterFromApiToVm` isn't exported:** it's only used in here, and `.map` only passes it characters that exist. That's why, like `mapEpisodeFromApiToVm`, it doesn't need its own guard.

_./src/pods/character-list/character-list.container.tsx_

```tsx
import React from "react";
import { ErrorMessage, Spinner } from "#common/components";
import { getCharacterPage } from "./api";
import { CharacterListComponent } from "./character-list.component";
import { mapCharacterListFromApiToVm } from "./character-list.mapper";
import type { Character } from "./character-list.vm";

export const CharacterListContainer = () => {
  const [characters, setCharacters] = React.useState<Character[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadCharacters = () => {
      setIsLoading(true);
      setError("");

      getCharacterPage()
        .then((characterPage) =>
          setCharacters(mapCharacterListFromApiToVm(characterPage)),
        )
        .catch((error: Error) => setError(error.message))
        .finally(() => setIsLoading(false));
    };

    loadCharacters();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return <CharacterListComponent characters={characters} />;
};
```

Same pattern as the detail: `loadCharacters` inside the effect sets `isLoading` to `true` and clears the error before fetching, and the `finally` sets it back to `false`.

⚠️ **The names are very similar.** The rule: **`…ApiModel` is what the server sends; no suffix is what the screen renders.**

## 4. The second promotion: `common/helpers`

Look at both `api.ts` files: the same `safeParse` + `console.error` + `throw` block is in both. When something born in one pod is needed by another, it moves up to `common`: the **promotion principle** (pod → common → library), the same one that moved the spinner and the error up to `common/components` in `03-pods`.

```bash
mkdir -p src/common/helpers
```

_./src/common/helpers/validate-response.ts_ — **new file**

```ts
import { z } from "zod";

export const validateResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("La API ha cambiado:", z.treeifyError(result.error));
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }

  return result.data;
};
```

_./src/common/helpers/index.ts_ — **new file**

```ts
export * from "./validate-response";
```

And both `api.ts` files use it:

_./src/pods/character-detail/api/character-detail.api.ts_

```diff
- import { z } from "zod";
+ import { validateResponse } from "#common/helpers";
  ...
-   const result = characterDetailSchema.safeParse(await response.json());
-
-   if (!result.success) {
-     console.error("La API ha cambiado:", z.treeifyError(result.error));
-     throw new Error("La respuesta del servidor no tiene el formato esperado");
-   }
-
-   return result.data;
+   return validateResponse(characterDetailSchema, await response.json());
```

_./src/pods/character-list/api/character-list.api.ts_

```diff
- import { z } from "zod";
+ import { validateResponse } from "#common/helpers";
  ...
-   const result = characterPageSchema.safeParse(await response.json());
-
-   if (!result.success) {
-     console.error("La API ha cambiado:", z.treeifyError(result.error));
-     throw new Error("La respuesta del servidor no tiene el formato esperado");
-   }
-
-   return result.data;
+   return validateResponse(characterPageSchema, await response.json());
```

- **Why `common` and not `core`?** `core` is plumbing for *this* app (its routes, its session). `validateResponse` knows nothing about characters: you could take it to any project. That's `common`.
- **Why `helpers` and not `api`?** It doesn't talk to any server: it takes a schema and some data, and validates. The api lives in each pod (its `api/` folder), and the app's api configuration would go in `core`. A domain-free helper is exactly what goes in `common`.
- **The `<T>` generic:** you pass a schema and it returns its type. That way api functions return the right type without any `as`.

## 5. Login: and here, **no** mapper

```bash
mkdir -p src/pods/login/api
```

_./src/pods/login/api/login.api.ts_ — **new file**

```ts
import type { UserSession } from "#core/auth";
import type { Credentials } from "../login.schema";

export const login = async (credentials: Credentials): Promise<UserSession> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).catch(() => {
    throw new Error("No se ha podido conectar con el servidor");
  });
  const data = await response.json().catch(() => {
    throw new Error("No se ha podido conectar con el servidor");
  });

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
```

_./src/pods/login/api/index.ts_ — **new file**

```ts
export * from "./login.api";
```

⚠️ **No api model and no mapper, on purpose.** The server returns exactly `{ username, name }`, which is our `UserSession`. A mapper copying two fields would be **over-architecture**. The day they stop matching, you add one.

- **The two `.catch`** turn a connection failure into a readable message. The one on `fetch` fires when there is no network. The one on `json()` fires when the server is down: in development the request goes through the Vite proxy, which answers a `502` with no body, and reading it as JSON throws.
- `login.schema.ts` is **not** an api model: it validates the form, not the response. That's why it stays outside `api/`.

_./src/pods/login/login.container.tsx_

```diff
  import { ROUTES } from "#core/router";
+ import { login } from "./api";
  import { LoginComponent } from "./login.component";
  ...
      try {
-       const response = await fetch("/api/login", {
-         method: "POST",
-         headers: { "Content-Type": "application/json" },
-         body: JSON.stringify(credentials),
-       });
-       const data = await response.json();
-
-       if (!response.ok) {
-         setError(data.message);
-         return;
-       }
-
-       setUserSession(data);
+       const userSession = await login(credentials);
+       setUserSession(userSession);
        navigate(ROUTES.CHARACTERS);
-     } catch {
-       setError("No se ha podido conectar con el servidor");
+     } catch (error) {
+       setError((error as Error).message);
      } finally {
```

## 6. The session, same thing

_./src/core/auth/auth.api.ts_ — **new file**

```ts
import type { UserSession } from "./auth.vm";

export const getUserSession = async (): Promise<UserSession | null> => {
  const response = await fetch("/api/me");

  return response.ok ? response.json() : null;
};

export const logout = async (): Promise<void> => {
  await fetch("/api/logout", { method: "POST" });
};
```

_./src/core/auth/auth.provider.tsx_

```diff
  import React from "react";
+ import * as api from "./auth.api";
  import { AuthContext } from "./auth.context";
  ...
    React.useEffect(() => {
-     fetch("/api/me")
-       .then((response) => (response.ok ? response.json() : null))
-       .then((userSession) => {
-         setUserSession(userSession);
-       })
+     api
+       .getUserSession()
+       .then(setUserSession)
        .catch(() => setUserSession(null))
        .finally(() => setIsChecking(false));
    }, []);

    const logout = async () => {
-     await fetch("/api/logout", { method: "POST" });
+     await api.logout();
      setUserSession(null);
    };
```

`import * as api` avoids the name clash between the api's `logout` function and the provider's `logout`. `auth.api.ts` isn't exported from the `core/auth` barrel: it's an internal detail.

## Result

```
src/
├── App.tsx
├── common/
│   ├── components/              ← spinner and error (from `03-pods`)
│   └── helpers/                 ← domain-free, can become a library
│       ├── index.ts
│       └── validate-response.ts
├── core/
│   ├── auth/                    ← context, provider, hook, api, vm
│   └── router/                  ← routes, router, guard
├── layouts/                     ← app, center
├── pods/
│   ├── login/
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   └── login.api.ts
│   │   ├── index.ts
│   │   ├── login.component.tsx
│   │   ├── login.container.tsx
│   │   └── login.schema.ts
│   ├── character-list/
│   │   ├── api/
│   │   │   ├── character-list.api-model.ts
│   │   │   ├── character-list.api.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── character-list.component.tsx
│   │   ├── character-list.container.tsx
│   │   ├── character-list.mapper.ts
│   │   ├── character-list.vm.ts
│   │   └── index.ts
│   └── character-detail/
│       ├── api/
│       │   ├── character-detail.api-model.ts
│       │   ├── character-detail.api.ts
│       │   └── index.ts
│       ├── components/
│       ├── character-detail.component.tsx
│       ├── character-detail.container.tsx
│       ├── character-detail.mapper.ts
│       ├── character-detail.vm.ts
│       └── index.ts
└── scenes/                      ← dumb: layout + pod
```

## What we gained

| | |
| --- | --- |
| `api/` | Only there do we know the url, HTTP codes and JSON shape |
| api model (zod) | The server contract, and it's validated too |
| view model | What the screen needs, with the screen's names |
| mapper | Customs: if the server changes, you touch it here |
| `common/` | What no longer belongs to one pod nor to this app |
| containers | Request, translate and store. Nothing else |

## Try it

```bash
pnpm install
pnpm start
```

- Everything works the same: login, list, detail, `/characters/99999`, `Salir` (Log out).
- **Break the contract:** `pnpm start` runs server and front together, so stop it (Ctrl+C) and run each one in its own terminal, the server in broken mode:

  ```bash
  pnpm start:front
  ```

  ```bash
  pnpm start:server:broken
  ```

  That mode returns `characterId` instead of `id`. Reload the list: the screen shows "La respuesta del servidor no tiene el formato esperado" and the console shows `La API ha cambiado:` with a tree telling you **which field** fails. The app didn't render garbage, and what you'd need to touch to adapt is clear: the list's api model and mapper.

- Go back to the normal server: stop the broken one and run `pnpm start:server` (or stop both and run `pnpm start` again).
