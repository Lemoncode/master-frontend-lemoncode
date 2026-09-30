# 04 List — fetching data and rendering cards

**Starts from:** `03-login-zod`.

Login works, but once inside there's only a title and a test link. In this step we fetch **the characters from the server** and render them as cards, with **loading** and **error** states. And we split the work: one component **gets** the data and another one **renders** it.

## What this step touches

```
src/
  character-list.tsx   ← fetches the data, handles loading and error, hands it out
  character-card.tsx   ← new: the card, it only renders
```

## What the server returns

```
GET /api/characters
```

```json
{
  "info": { "pages": 42, "count": 826 },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "gender": "Male",
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      "origin": "Earth (C-137)",
      "location": "Citadel of Ricks",
      "episodeCount": 51
    }
  ]
}
```

Our server already **flattens** the public API: `origin` arrives as text and, instead of the list of episodes, it sends how many there are. You can open `http://localhost:5173/api/characters` in the browser to see it.

# Steps

## 1. The character type

_./src/character-list.tsx_

```diff
- import { Link } from "react-router";
+ import React from "react";
+ import { CharacterCard } from "./character-card";

+ export interface Character {
+   id: number;
+   name: string;
+   status: string;
+   species: string;
+   image: string;
+ }
+
```

Only the fields we'll render. It's exported because the card needs it too.

⚠️ **Typing is not validating.** This `interface` tells TypeScript what we *believe* the data looks like, but nobody checks it at runtime: if the server changes a field, the app finds out too late. Validating the response with zod is done in `05b-architecture/04-api`.

## 2. Three states and an effect

```diff
  export const CharacterListPage = () => {
+   const [characters, setCharacters] = React.useState<Character[]>([]);
+   const [isLoading, setIsLoading] = React.useState(true);
+   const [error, setError] = React.useState("");
+
+   React.useEffect(() => {
+     fetch("/api/characters")
+       .then((response) => {
+         if (!response.ok) {
+           throw new Error("El servidor ha contestado con un error");
+         }
+
+         return response.json();
+       })
+       .then((data) => setCharacters(data.results))
+       .catch(() => setError("No se han podido cargar los personajes"))
+       .finally(() => setIsLoading(false));
+   }, []);
```

- **`useEffect` with `[]`**: runs once, when the component mounts. Without the array it would run on every render and you'd loop forever.
- **`isLoading` starts as `true`**: the first render happens **before** the response arrives, so we start in loading mode.
- **`fetch` doesn't fail on a 500**: it only fails when there's no network. That's why we check `response.ok` and throw ourselves, so `.catch` picks it up.
- **`.finally`** turns the spinner off whether it went well or not.
- We store `data.results`: the list is inside the object, it isn't the object.

⚠️ **In the Network tab you'll see the request twice.** That's `StrictMode`, which in development mounts, unmounts and remounts components to reveal badly written effects. In production it happens once.

## 3. Render each state

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
+       <div className="alert alert-error">
+         <span>{error}</span>
+       </div>
+     );
+   }
+
    return (
-     <div className="flex flex-col items-start gap-4">
-       <h2 className="text-2xl font-bold">Personajes</h2>
-       <Link className="btn btn-primary" to="/characters/2">
-         Ver el detalle de Morty
-       </Link>
+     <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
+       {characters.map((character) => (
+         <CharacterCard key={character.id} character={character} />
+       ))}
      </div>
    );
  };
```

- **Early `return`s** keep each state in its own block: loading first, then error and, at the end, the happy path.
- **`key={character.id}`** tells React which card is which. It must be **unique and stable**: the server `id`, never the array index.
- The grid is responsive: one column on mobile, two on `sm` and four on `lg`.

## 4. The card

_./src/character-card.tsx_ — **new file**

```tsx
import { Link } from "react-router";
import type { Character } from "./character-list";

interface Props {
  character: Character;
}

const statusColor: Record<Character["status"], string> = {
  Alive: "badge-success",
  Dead: "badge-error",
  unknown: "badge-ghost",
};

export const CharacterCard = (props: Props) => {
  const { character } = props;

  return (
    <Link
      className="card bg-base-100 border-base-300 border transition hover:-translate-y-1 hover:shadow-lg"
      to={`/characters/${character.id}`}
    >
      <figure>
        <img src={character.image} alt={character.name} />
      </figure>

      <div className="card-body gap-2 p-4">
        <h3 className="card-title text-base">{character.name}</h3>
        <span className={`badge badge-sm ${statusColor[character.status]}`}>
          {character.status}
        </span>
        <span className="text-sm opacity-60">{character.species}</span>
      </div>
    </Link>
  );
};
```

- **The card fetches nothing and doesn't know where the data comes from**: it gets a character via props and renders it. The list gets, the card renders. This split is the core idea of `../../05b-architecture`.
- **The whole card is a `Link`**: click anywhere and it goes to the detail.
- **`statusColor`** maps the status to a daisyUI class with an object instead of a chain of `if`s.
- **`alt={character.name}`**: the image needs alternative text for screen readers.

⚠️ **`status` is `string` in our `interface`**, so `Record<Character["status"], string>` ends up as `Record<string, string>` and TypeScript won't warn you if a color is missing. When the type comes from a zod schema with `z.enum` (in `05b-architecture/04-api`), it will.

## Result

```
src/
  App.tsx
  app-layout.tsx
  character-card.tsx    ← new
  character-detail.tsx
  character-list.tsx    ← fetches and hands out
  index.css
  login.schema.ts
  login.tsx
  main.tsx
  private-routes.tsx
  session.tsx
```

## Try it

```bash
pnpm start
```

- Log in with `admin` / `test`: the spinner shows up (the server waits 600 ms on purpose) and then twenty cards.
- Click a card: you go to `/characters/:id` (the detail is still a placeholder).
- **Chaos mode**: with the app open, run `curl -X POST http://localhost:3000/api/chaos` and reload. You get **"No se han podido cargar los personajes"**. Run the `curl` again to turn it off.
- **Network** tab: the request to `/api/characters` appears twice (StrictMode).

**Next:** `05-detail` — the detail screen with its episodes.
