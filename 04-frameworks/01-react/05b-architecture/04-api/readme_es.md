# 04 API — fronteras: api model, view model y mapper

> **Parte de `03-pods`.** Cada pantalla es un pod con container y component, pero el container sigue sabiendo demasiado. Y el listado **todavía no valida con zod** (se quedó pendiente en clase: lo resolvemos aquí).

## Qué toca este paso

Abre `pods/character-detail/character-detail.container.tsx` y fíjate en todo lo que sabe:

1. La url: `` `/api/characters/${id}` ``.
2. Los códigos HTTP: `404`, `!response.ok`.
3. El esquema de zod y el `safeParse`.
4. Los estados: `character`, `isLoading`, `error`.

Solo lo último es trabajo del container: tener los datos listos para la pantalla. Lo demás es **hablar con el servidor**, y va a otro sitio.

La idea clave es separar dos modelos:

| Modelo         | Qué es                                 | Dónde                         |
| -------------- | -------------------------------------- | ----------------------------- |
| **api model**  | Lo que manda el servidor (el contrato) | `api/*.api-model.ts`, con zod |
| **view model** | Lo que necesita la pantalla            | `*.vm.ts`                     |

Y entre los dos, el **mapper**, que hace de aduana. Si mañana cambia el servidor, se toca el api model y el mapper; la pantalla no se entera.

```
src/
  common/helpers/validate-response.ts                     ← nuevo (promoción)
  common/helpers/index.ts                                 ← nuevo
  core/auth/auth.api.ts                                   ← nuevo
  core/auth/auth.provider.tsx                             ← usa la api
  pods/login/api/login.api.ts                             ← nuevo
  pods/login/api/index.ts                                 ← nuevo
  pods/login/login.container.tsx                          ← usa la api
  pods/character-list/api/character-list.api-model.ts     ← nuevo
  pods/character-list/api/character-list.api.ts           ← nuevo
  pods/character-list/api/index.ts                        ← nuevo
  pods/character-list/character-list.mapper.ts            ← nuevo
  pods/character-list/character-list.vm.ts               ← status tipado
  pods/character-list/character-list.container.tsx        ← usa api + mapper
  pods/character-detail/api/character-detail.api-model.ts ← nuevo (era character-detail.schema.ts)
  pods/character-detail/api/character-detail.api.ts       ← nuevo
  pods/character-detail/api/index.ts                      ← nuevo
  pods/character-detail/character-detail.vm.ts            ← nuevo
  pods/character-detail/character-detail.mapper.ts        ← nuevo
  pods/character-detail/character-detail.container.tsx    ← usa api + mapper
  pods/character-detail/character-detail.component.tsx    ← tipo del vm
  pods/character-detail/components/episode-table.component.tsx ← campos del vm
```

# Pasos

## 1. La api del detalle

**El contrato.** Lo que antes era `character-detail.schema.ts` pasa a llamarse por lo que es: el modelo de la api.

```bash
mkdir -p src/pods/character-detail/api
```

_./src/pods/character-detail/api/character-detail.api-model.ts_ — **fichero nuevo**

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

⚠️ **El detalle no hace `.extend` del api model del listado.** Cada pod tiene su propio contrato. Se repiten unos cuantos campos, pero a cambio los pods son **independientes**: puedes borrar el listado entero y el detalle no se entera.

**La llamada:**

_./src/pods/character-detail/api/character-detail.api.ts_ — **fichero nuevo**

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

Dentro de la api se usa `async/await` porque se lee de arriba abajo: pides, compruebas, validas, devuelves.

La validación con zod es la misma que tenía el container, con una diferencia: **lanza un error** en vez de llamar a `setError`, porque la api no sabe nada de estados de React. El container lo recoge en su `.catch`. Todavía no la sacamos a una función: en el paso 3 el listado necesitará lo mismo y en el 4 se promociona.

_./src/pods/character-detail/api/index.ts_ — **fichero nuevo**

```ts
export * from "./character-detail.api";
export * from "./character-detail.api-model";
```

## 2. View model y mapper del detalle

En la tabla pintábamos `episode.episode`... que es el código del episodio (`S01E01`). **Ese nombre lo eligió el servidor, no nosotros.** El view model usa los nombres que tienen sentido para la pantalla:

_./src/pods/character-detail/character-detail.vm.ts_ — **fichero nuevo**

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

_./src/pods/character-detail/character-detail.mapper.ts_ — **fichero nuevo**

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

- **`import type * as apiModel` / `viewModel`:** al leer el mapper, el prefijo dice de qué lado de la frontera está cada tipo.
- **¿Copiar campo a campo no es trabajo de más?** Hoy los dos modelos se parecen mucho. El día que el servidor renombre `airDate` a `air_date`, cambias **una línea del mapper** y ningún componente.
- **La guarda en `episodes`:** si la lista de episodios llega `null` o `undefined`, `character.episodes.map(...)` revienta y se cae la pantalla entera. Con la guarda, el view model recibe un array vacío y la tabla simplemente sale sin filas. Hoy zod ya exige que sea un array, pero el mapper es la aduana y no debería depender de eso: si mañana el esquema lo marca como opcional, o alguien llama al mapper con datos sin validar, la aplicación no se cae.
- **¿Y `mapEpisodeFromApiToVm`?** No lleva guarda porque no se exporta: solo se usa dentro de `mapCharacterDetailFromApiToVm`, y el `.map` solo le pasa episodios que existen. Si lo exportaras y se usara desde fuera, habría que comprobar también que `episode` no es `null` o `undefined` antes de leer sus campos.

**La tabla usa los nombres del view model:**

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

**Y el container adelgaza:** pide un personaje, lo traduce y lo guarda.

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

Ya nadie importa el esquema viejo, así que se puede borrar. Si lo borras antes, el container, el component y la tabla se quedan con imports rotos a mitad de paso.

```bash
rm src/pods/character-detail/character-detail.schema.ts
```

## 3. El listado: por fin con zod

Mismo patrón. El contrato de la página de personajes:

```bash
mkdir -p src/pods/character-list/api
```

_./src/pods/character-list/api/character-list.api-model.ts_ — **fichero nuevo**

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

_./src/pods/character-list/api/character-list.api.ts_ — **fichero nuevo**

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

_./src/pods/character-list/api/index.ts_ — **fichero nuevo**

```ts
export * from "./character-list.api";
export * from "./character-list.api-model";
```

**El view model gana un tipo de verdad para el estado:**

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

Con eso, el `Record<Character["status"], string>` de colores de la tarjeta vuelve a estar tipado de verdad: si aparece un estado nuevo, TypeScript te obliga a darle color.

Aquí se ve la diferencia entre modelos: el servidor manda **nueve campos** más la paginación; la tarjeta usa **cinco**, y el view model tiene cinco. El resto se queda en la aduana.

_./src/pods/character-list/character-list.mapper.ts_ — **fichero nuevo**

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

- **La misma guarda que en el detalle:** si `results` llega `null` o `undefined`, el listado sale vacío en vez de caerse la pantalla.
- **`mapCharacterFromApiToVm` no se exporta:** solo se usa aquí dentro, y el `.map` solo le pasa personajes que existen. Por eso, igual que `mapEpisodeFromApiToVm`, no necesita guarda propia.

_./src/pods/character-list/character-list.container.tsx_

```diff
import React from "react";
import { ErrorMessage, Spinner } from "#common/components";
+ import { getCharacterPage } from "./api";
import { CharacterListComponent } from "./character-list.component";
+ import { mapCharacterListFromApiToVm } from "./character-list.mapper";
import type { Character } from "./character-list.vm";

export const CharacterListContainer = () => {
  const [characters, setCharacters] = React.useState<Character[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadCharacters = () => {
      setIsLoading(true);
      setError("");

-      fetch("/api/characters")
-      .then((response) => {
-        if (!response.ok) {
-          throw new Error("El servidor ha contestado con un error");
-        }

-        return response.json();
-      })
-      .then((data) => setCharacters(data.results))
+      getCharacterPage()
+        .then((characterPage) =>
+          setCharacters(mapCharacterListFromApiToVm(characterPage)),
+        )
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

Queda con el mismo patrón que el detalle: `loadCharacters` dentro del efecto, que pone `isLoading` a `true` y limpia el error antes de pedir, y el `finally` lo vuelve a `false`.

⚠️ **Los nombres se parecen mucho.** La regla: **`…ApiModel` es lo que manda el servidor; sin sufijo, lo que pinta la pantalla.**

## 4. La segunda promoción: `common/helpers`

Mira los dos `api.ts`: el mismo bloque de `safeParse` + `console.error` + `throw` está en los dos. Cuando algo que nació en un pod lo necesita otro, sube a `common`: es el **principio de promoción** (pod → common → librería), el mismo que en `03-pods` subió el spinner y el error a `common/components`.

```bash
mkdir -p src/common/helpers
```

_./src/common/helpers/validate-response.ts_ — **fichero nuevo**

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

_./src/common/helpers/index.ts_ — **fichero nuevo**

```ts
export * from "./validate-response";
```

Y los dos `api.ts` la usan:

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

- **¿Por qué `common` y no `core`?** `core` es fontanería de _esta_ aplicación (sus rutas, su sesión). `validateResponse` no sabe nada de personajes: se podría llevar a cualquier proyecto. Eso es `common`.
- **¿Por qué `helpers` y no `api`?** No habla con ningún servidor: recibe un esquema y un dato, y valida. La api vive en cada pod (su carpeta `api/`), y la configuración de la api de la aplicación iría en `core`. Un helper sin dominio es justo lo que va en `common`.
- **El genérico `<T>`:** le pasas un esquema y devuelve su tipo. Así las funciones de api devuelven el tipo correcto sin ningún `as`.

## 5. Login: y aquí, **sin** mapper

```bash
mkdir -p src/pods/login/api
```

_./src/pods/login/api/login.api.ts_ — **fichero nuevo**

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

_./src/pods/login/api/index.ts_ — **fichero nuevo**

```ts
export * from "./login.api";
```

⚠️ **No hay api model ni mapper, a propósito.** El servidor devuelve exactamente `{ username, name }`, que es nuestro `UserSession`. Un mapper que copia dos campos sería **sobrearquitectura**. El día que dejen de coincidir, se añade.

- **Los dos `.catch`** convierten un fallo de conexión en un mensaje entendible. El del `fetch` salta si no hay red. El del `json()` salta con el servidor apagado: en desarrollo la petición pasa por el proxy de Vite, que contesta un `502` sin cuerpo, y leerlo como JSON revienta.
- `login.schema.ts` **no** es un api model: valida el formulario, no la respuesta. Por eso se queda fuera de `api/`.

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

## 6. La sesión, igual

_./src/core/auth/auth.api.ts_ — **fichero nuevo**

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

`import * as api` evita el choque de nombres entre la función `logout` de la api y la `logout` del proveedor. `auth.api.ts` no sale del barrel de `core/auth`: es un detalle interno.

## Cómo queda

```
src/
├── App.tsx
├── common/
│   ├── components/              ← spinner y error (de `03-pods`)
│   └── helpers/                 ← sin dominio, promocionable a librería
│       ├── index.ts
│       └── validate-response.ts
├── core/
│   ├── auth/                    ← contexto, proveedor, hook, api, vm
│   └── router/                  ← rutas, router, portero
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
└── scenes/                      ← tontas: layout + pod
```

## Lo que hemos ganado

|                 |                                                               |
| --------------- | ------------------------------------------------------------- |
| `api/`          | Solo ahí se sabe la url, los códigos HTTP y la forma del JSON |
| api model (zod) | El contrato con el servidor, y además se valida               |
| view model      | Lo que necesita la pantalla, con nombres de la pantalla       |
| mapper          | La aduana: si cambia el servidor, se toca aquí                |
| `common/`       | Lo que ya no es de un pod ni de esta aplicación               |
| containers      | Piden, traducen y guardan. Nada más                           |

## Pruébalo

```bash
pnpm install
pnpm start
```

- Todo funciona igual: login, listado, detalle, `/characters/99999`, Salir.
- **Rompe el contrato:** `pnpm start` levanta servidor y front juntos, así que páralo (Ctrl+C) y lanza cada uno en su terminal, el servidor en modo roto:

  ```bash
  pnpm start:front
  ```

  ```bash
  pnpm start:server:broken
  ```

  Ese modo devuelve `characterId` en vez de `id`. Recarga el listado: en pantalla sale "La respuesta del servidor no tiene el formato esperado" y en la consola, `La API ha cambiado:` con el árbol que dice **qué campo** falla. La aplicación no ha pintado basura, y lo que habría que tocar para adaptarse está claro: el api model y el mapper del listado.

- Vuelve al servidor normal: para el roto y lanza `pnpm start:server` (o para los dos y vuelve a `pnpm start`).
