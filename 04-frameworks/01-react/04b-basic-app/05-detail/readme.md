# 05 Detail — one character, its episodes and the dependency array

**Starts from:** `04-list`.

We already know how to fetch **a list**. Now we fetch **one item**: the detail screen, which so far only showed the `id`, now shows the character card and its first episodes. And the missing piece of effects shows up: **the dependency array**. This time we also **validate the response with zod**.

This step is the code as we left it in class, and the starting point of `../05-architecture`.

## What this step touches

```
src/
  character.schema.ts    ← new: what a character with its episodes must look like
  episode-table.tsx      ← new: the episodes table, it only renders
  character-detail.tsx   ← fetches, validates and renders the card
```

## What the server returns

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

It's the list character **plus two things**: `gender` and `episodes` (the first five). If the `id` doesn't exist, it answers **404**.

# Steps

## 1. The schema: extend instead of repeat

_./src/character.schema.ts_ — **new file**

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

- **`.extend`** builds a new schema from another one, adding fields. The detail is "the character plus `gender` and `episodes`", and that's how it's written. If the character gains a field, you change it in **one place**.
- **`z.enum`** restricts `status` to three values; **`z.url()`** checks the image is a url.
- **`z.array(episodeSchema)`**: a schema inside another one. zod validates the whole list, item by item.
- Types come out of the schema with `z.infer`, just like in the login.

⚠️ **`characterSchema` isn't exported** and the list still uses its own `interface Character`: in class we only validated the detail. Validating the list too is done in `05-architecture/04-api`.

## 2. The episodes table

_./src/episode-table.tsx_ — **new file**

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

Just like the list card: **it gets the data via props and renders it**. `overflow-x-auto` keeps the table from breaking the layout on mobile.

## 3. States and fetching by `id`

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

- **`[id]` instead of `[]`**: the effect runs again **every time the `id` changes**. With `[]` it would only run on mount, and clicking "Next" would change the url but not the card.
- ⚠️ **Why `setIsLoading(true)` and `setError("")` at the start**: when navigating from one character to another, React **doesn't unmount** the component, it just changes the `id`. Without resetting those states, an error from the previous character would stay on screen, or the spinner wouldn't show.
- **404 has its own message**: "doesn't exist" isn't the same as "the server failed". `.catch` shows each error's `message`.
- **`safeParse` on the response**: if the API changes, zod catches it here. **`z.treeifyError`** keeps the detail shaped like the object, so the console tells you **which field** fails. The screen gets a human-readable message.
- The state starts as **`null`** (no character yet), unlike the list, which started with an empty array.

## 4. Loading, error and character

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

- The error comes with a **link back**: in a detail page, an error with no way out traps the user.
- **`if (!character) return null`** reassures TypeScript: from here on `character` can't be `null`.

## 5. The card

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

- **Previous / Next** sit below the back link, grouped with `join`. "Previous" doesn't show on character 1.
- **Next doesn't check the end**: on the last character it leads to a 404, and the "Ese personaje no existe" message covers it.
- **`sm:card-side`**: on mobile the image goes on top, on medium screens beside the text.
- **`<dl>`, `<dt>` and `<dd>`** are the HTML tags for "name → value" pairs, more correct than loose `div`s.

## Result

```
src/
  App.tsx
  app-layout.tsx
  character-card.tsx
  character-detail.tsx   ← fetches, validates and renders
  character-list.tsx
  character.schema.ts    ← new
  episode-table.tsx      ← new
  index.css
  login.schema.ts
  login.tsx
  main.tsx
  private-routes.tsx
  session.tsx
```

Thirteen loose files in `src/`. It works, but "where do I put the next thing?" no longer has an easy answer: that's `../05-architecture`.

## Try it

```bash
pnpm start
```

- Click a card: spinner, character card and episodes table.
- Click **Next** a few times: the url changes **and** so does the card (thanks to `[id]`). The **Network** tab shows one request per change.
- Go to `/characters/99999`: **"Ese personaje no existe"** with the button back.
- Character 1: "Previous" doesn't show.

**Next:**

- What we didn't have time for in class is covered in `05-architecture`: zod in the list in `04-api`, and actions, live validation and Suspense in its final annexes.
- `../05-architecture` starts from this code as is.
