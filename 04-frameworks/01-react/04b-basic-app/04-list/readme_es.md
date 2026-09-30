# 04 Listado — pedir datos y pintar tarjetas

**Parte de:** `03-login-zod`.

El login funciona, pero al entrar solo hay un título y un enlace de prueba. En este paso traemos **los personajes del servidor** y los pintamos en tarjetas, con sus estados de **cargando** y **error**. Y repartimos el trabajo: un componente **consigue** los datos y otro **los pinta**.

## Qué toca este paso

```
src/
  character-list.tsx   ← pide los datos, gestiona carga y error, reparte
  character-card.tsx   ← nuevo: la tarjeta, solo pinta
```

## Lo que devuelve el servidor

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

Nuestro servidor ya **aplana** la API pública: `origin` llega como texto y, en vez de la lista de episodios, manda cuántos son. Puedes abrir `http://localhost:5173/api/characters` en el navegador para verlo.

# Pasos

## 1. El tipo del personaje

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

Solo los campos que vamos a pintar. Se exporta porque la tarjeta también lo necesita.

⚠️ **Tipar no es validar.** Esta `interface` le dice a TypeScript cómo *creemos* que llega el dato, pero en ejecución nadie lo comprueba: si el servidor cambia un campo, la aplicación se entera tarde. Validar la respuesta con zod se hace en `05b-architecture/04-api`.

## 2. Tres estados y un efecto

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

- **`useEffect` con `[]`**: se ejecuta una vez, al montar el componente. Sin el array, se ejecutaría en cada pintado y entrarías en bucle.
- **`isLoading` empieza en `true`**: el primer pintado ocurre **antes** de que llegue la respuesta, así que arrancamos cargando.
- **`fetch` no falla con un 500**: solo falla si no hay red. Por eso comprobamos `response.ok` y lanzamos nosotros el error, para que lo recoja el `.catch`.
- **`.finally`** apaga el spinner tanto si va bien como si va mal.
- Guardamos `data.results`: la lista está dentro del objeto, no es el objeto.

⚠️ **En la pestaña Red verás la petición dos veces.** Es `StrictMode`, que en desarrollo monta, desmonta y vuelve a montar los componentes para destapar efectos mal escritos. En producción sale una sola vez.

## 3. Pintar cada estado

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

- Los **`if` con `return` temprano** dejan cada estado en su bloque: primero cargando, luego error y, al final, el caso bueno.
- **`key={character.id}`** le dice a React qué tarjeta es cuál. Tiene que ser un valor **único y estable**: el `id` del servidor, nunca el índice del array.
- La rejilla es responsive: una columna en móvil, dos en `sm` y cuatro en `lg`.

## 4. La tarjeta

_./src/character-card.tsx_ — **fichero nuevo**

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

- **La tarjeta no pide nada ni sabe de dónde salen los datos**: recibe un personaje por props y lo pinta. El listado consigue, la tarjeta pinta. Esta división es la idea central de `../../05b-architecture`.
- **Toda la tarjeta es un `Link`**: se pincha en cualquier sitio y lleva al detalle.
- **`statusColor`** traduce el estado a una clase de daisyUI con un objeto, en vez de una cadena de `if`.
- **`alt={character.name}`**: la imagen necesita texto alternativo para lectores de pantalla.

⚠️ **`status` es `string` en nuestra `interface`**, así que `Record<Character["status"], string>` acaba siendo `Record<string, string>` y TypeScript no avisa si falta un color. Cuando el tipo salga de un esquema de zod con `z.enum` (en `05b-architecture/04-api`), sí lo hará.

## Cómo queda

```
src/
  App.tsx
  app-layout.tsx
  character-card.tsx    ← nuevo
  character-detail.tsx
  character-list.tsx    ← pide y reparte
  index.css
  login.schema.ts
  login.tsx
  main.tsx
  private-routes.tsx
  session.tsx
```

## Pruébalo

```bash
pnpm start
```

- Entra con `admin` / `test`: sale el spinner (el servidor tarda 600 ms a propósito) y luego veinte tarjetas.
- Pincha una tarjeta: vas a `/characters/:id` (el detalle todavía es un marcador).
- **Modo caos**: con la aplicación abierta, ejecuta `curl -X POST http://localhost:3000/api/chaos` y recarga. Sale **"No se han podido cargar los personajes"**. Repite el `curl` para apagarlo.
- Pestaña **Red**: la petición a `/api/characters` aparece dos veces (StrictMode).

**Siguiente:** `05-detail` — la pantalla de detalle con sus episodios.
