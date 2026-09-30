# 05 Detalle — un personaje, sus episodios y el array de dependencias

**Parte de:** `04-list`.

Ya sabemos pedir **una lista**. Ahora pedimos **un elemento**: la pantalla de detalle, que hasta ahora solo enseñaba el `id`, pasa a mostrar la ficha del personaje y sus primeros episodios. Y aparece la pieza de los efectos que faltaba: **el array de dependencias**. Esta vez, además, **validamos la respuesta con zod**.

Este paso es el código tal y como quedó en clase, y el punto de partida de `../../05b-architecture`.

## Qué toca este paso

```
src/
  character.schema.ts    ← nuevo: cómo tiene que venir un personaje con sus episodios
  episode-table.tsx      ← nuevo: la tabla de episodios, solo pinta
  character-detail.tsx   ← pide, valida y pinta la ficha
```

## Lo que devuelve el servidor

```
GET /api/characters/1
```

```json
{
  "id": 1,
  "name": "Rick Sanchez",
  "status": "Alive",
  "species": "Human",
  "gender": "Male",
  "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  "origin": "Earth (C-137)",
  "location": "Citadel of Ricks",
  "episodeCount": 51,
  "episodes": [
    { "id": 1, "name": "Pilot", "episode": "S01E01", "airDate": "December 2, 2013" }
  ]
}
```

Es el personaje del listado **más dos cosas**: `gender` y `episodes` (los cinco primeros). Si el `id` no existe, contesta **404**.

# Pasos

## 1. El esquema: extender en vez de repetir

_./src/character.schema.ts_ — **fichero nuevo**

```ts
import z from "zod";

const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  image: z.url(),
  origin: z.string(),
  location: z.string(),
  episodeCount: z.number(),
});

export const episodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode: z.string(),
  airDate: z.string(),
});

export const characterDetailSchema = characterSchema.extend({
  gender: z.string(),
  episodes: z.array(episodeSchema),
});

export type Character = z.infer<typeof characterSchema>;
export type Episode = z.infer<typeof episodeSchema>;
export type CharacterDetail = z.infer<typeof characterDetailSchema>;
```

- **`.extend`** crea un esquema nuevo a partir de otro, añadiendo campos. El detalle es "el personaje más `gender` y `episodes`", y así se escribe. Si el personaje gana un campo, se toca en **un solo sitio**.
- **`z.enum`** restringe `status` a tres valores; **`z.url()`** comprueba que la imagen sea una url.
- **`z.array(episodeSchema)`**: un esquema dentro de otro. zod valida la lista entera, elemento a elemento.
- Los tipos salen del esquema con `z.infer`, igual que en el login.

⚠️ **`characterSchema` no se exporta** y el listado sigue usando su propia `interface Character`: en clase solo validamos el detalle. Validar también el listado se hace en `05b-architecture/04-api`.

## 2. La tabla de episodios

_./src/episode-table.tsx_ — **fichero nuevo**

```tsx
import type { Episode } from "./character.schema";

interface Props {
  episodes: Episode[];
}

export const EpisodeTable = (props: Props) => {
  const { episodes } = props;

  return (
    <div className="card bg-base-100 border-base-300 border">
      <div className="card-body gap-4">
        <h3 className="card-title text-xl">Primeros episodios</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Emitido</th>
              </tr>
            </thead>

            <tbody>
              {episodes.map((episode) => (
                <tr key={episode.id}>
                  <td className="font-mono">{episode.episode}</td>
                  <td>{episode.name}</td>
                  <td className="opacity-60">{episode.airDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
```

Igual que la tarjeta del listado: **recibe los datos por props y pinta**. El `overflow-x-auto` evita que la tabla rompa el diseño en móvil.

## 3. Estados y petición con el `id`

_./src/character-detail.tsx_

```diff
+ import React from "react";
  import { Link, useParams } from "react-router";
+ import {
+   characterDetailSchema,
+   type CharacterDetail,
+ } from "./character.schema";
+ import z from "zod";
+ import { EpisodeTable } from "./episode-table";

  export const CharacterDetailPage = () => {
    const { id } = useParams<{ id: string }>();
+   const [character, setCharacter] = React.useState<CharacterDetail | null>(
+     null,
+   );
+   const [isLoading, setIsLoading] = React.useState(true);
+   const [error, setError] = React.useState("");
+
+   React.useEffect(() => {
+     const loadCharacter = () => {
+       setIsLoading(true);
+       setError("");
+
+       fetch(`/api/characters/${id}`)
+         .then((response) => {
+           if (response.status === 404) {
+             throw new Error("Ese personaje no existe");
+           }
+           if (!response.ok) {
+             throw new Error("El servidor ha contestado con un error");
+           }
+
+           return response.json();
+         })
+         .then((data) => {
+           const result = characterDetailSchema.safeParse(data);
+
+           if (!result.success) {
+             console.error("La API ha cambiado:", z.treeifyError(result.error));
+             setError("La respuesta del servidor no tiene el formato esperado");
+             return;
+           }
+
+           setCharacter(result.data);
+         })
+         .catch((error: Error) => setError(error.message))
+         .finally(() => setIsLoading(false));
+     };
+
+     loadCharacter();
+   }, [id]);
```

- **`[id]` en vez de `[]`**: el efecto se repite **cada vez que cambia el `id`**. Con `[]` solo se ejecutaría al montar, y al pulsar "Siguiente" la url cambiaría pero la ficha no.
- ⚠️ **Por qué `setIsLoading(true)` y `setError("")` al empezar**: al navegar de un personaje a otro, React **no desmonta** el componente, solo le cambia el `id`. Sin reiniciar esos estados, un error del personaje anterior se quedaría en pantalla, o no saldría el spinner.
- **El 404 tiene su propio mensaje**: no es lo mismo "no existe" que "el servidor ha fallado". El `.catch` enseña el `message` de cada error.
- **`safeParse` en la respuesta**: si la API cambia, zod lo caza aquí. **`z.treeifyError`** deja el detalle con la forma del objeto, para ver en la consola **qué campo** falla. En pantalla va un mensaje entendible.
- El estado empieza en **`null`** (todavía no hay personaje), a diferencia del listado, que empezaba con un array vacío.

## 4. Carga, error y personaje

```diff
+   if (isLoading) {
+     return (
+       <div className="flex justify-center p-10">
+         <span className="loading loading-spinner loading-lg" />
+       </div>
+     );
+   }
+
+   if (error) {
+     return (
+       <div className="flex flex-col items-start gap-4">
+         <div role="alert" className="alert alert-error">
+           <span>{error}</span>
+         </div>
+
+         <Link className="btn btn-primary" to="/characters">
+           Volver al listado
+         </Link>
+       </div>
+     );
+   }
+
+   if (!character) {
+     return null;
+   }
```

- El error trae un **enlace para volver**: en el detalle, un error sin salida deja al usuario atrapado.
- **`if (!character) return null`** tranquiliza a TypeScript: a partir de aquí `character` ya no puede ser `null`.

## 5. La ficha

```diff
    return (
-     <div className="flex flex-col items-start gap-4">
-       <h2 className="text-2xl font-bold">Detalle del personaje</h2>
-       <h3>Id: {id}</h3>
-       <Link className="btn btn-primary" to="/characters">
-         Volver al listado
+     <div className="flex flex-col gap-6">
+       <Link className="btn btn-ghost w-fit" to="/characters">
+         ← Volver al listado
        </Link>
+
+       <div className="join">
+         {character.id > 1 && (
+           <Link
+             className="btn join-item"
+             to={`/characters/${character.id - 1}`}
+           >
+             Anterior
+           </Link>
+         )}
+
+         <Link className="btn join-item" to={`/characters/${character.id + 1}`}>
+           Siguiente
+         </Link>
+       </div>
+
+       <div className="card bg-base-100 border-base-300 sm:card-side border">
+         <figure className="sm:w-64 sm:shrink-0">
+           <img
+             className="h-full w-full object-cover"
+             src={character.image}
+             alt={character.name}
+           />
+         </figure>
+
+         <div className="card-body gap-4">
+           <h2 className="card-title text-3xl">{character.name}</h2>
+
+           <div className="flex flex-wrap gap-2">
+             <span className="badge badge-lg badge-primary">
+               {character.species}
+             </span>
+             <span className="badge badge-lg badge-ghost">
+               {character.gender}
+             </span>
+             <span className="badge badge-lg badge-ghost">
+               {character.status}
+             </span>
+           </div>
+
+           <dl className="grid gap-3 sm:grid-cols-2">
+             <div>
+               <dt className="text-sm opacity-60">Origen</dt>
+               <dd className="font-semibold">{character.origin}</dd>
+             </div>
+
+             <div>
+               <dt className="text-sm opacity-60">Última ubicación</dt>
+               <dd className="font-semibold">{character.location}</dd>
+             </div>
+
+             <div>
+               <dt className="text-sm opacity-60">Episodios</dt>
+               <dd className="font-semibold">{character.episodeCount}</dd>
+             </div>
+           </dl>
+         </div>
+       </div>
+       <EpisodeTable episodes={character.episodes} />
      </div>
    );
  };
```

- **Anterior / Siguiente** van debajo del enlace de volver, agrupados con `join`. "Anterior" no aparece en el personaje 1.
- **Siguiente no comprueba el final**: en el último personaje llevará a un 404, y el mensaje "Ese personaje no existe" lo cubre.
- **`sm:card-side`**: en móvil la imagen va arriba y en pantallas medianas, al lado.
- **`<dl>`, `<dt>` y `<dd>`** son las etiquetas HTML para pares "nombre → valor", más correctas que `div` sueltos.

## Cómo queda

```
src/
  App.tsx
  app-layout.tsx
  character-card.tsx
  character-detail.tsx   ← pide, valida y pinta
  character-list.tsx
  character.schema.ts    ← nuevo
  episode-table.tsx      ← nuevo
  index.css
  login.schema.ts
  login.tsx
  main.tsx
  private-routes.tsx
  session.tsx
```

Trece ficheros sueltos en `src/`. Funciona, pero "¿dónde meto lo siguiente?" ya no tiene respuesta fácil: eso es `../../05b-architecture`.

## Pruébalo

```bash
pnpm start
```

- Pincha una tarjeta: spinner, ficha y tabla de episodios.
- **Siguiente** varias veces: la url cambia **y** la ficha también (gracias a `[id]`). En la pestaña **Red** sale una petición por cada cambio.
- Ve a `/characters/99999`: **"Ese personaje no existe"** con el botón para volver.
- Personaje 1: no aparece "Anterior".

**Siguiente:**

- Lo que no dio tiempo en clase se ve en `05b-architecture`: zod en el listado en `04-api`, y actions, validación en vivo y Suspense en sus anexos del final.
- `../../05b-architecture` parte de este código tal cual.
