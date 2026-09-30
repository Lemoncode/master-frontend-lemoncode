import React from "react";
import { CharacterCard } from "#character-card";

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const CharacterListScene = () => {
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

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};
