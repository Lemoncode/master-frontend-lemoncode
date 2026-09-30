import React from "react";
import { ErrorMessage, Spinner } from "#common/components";
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
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return <CharacterListComponent characters={characters} />;
};
