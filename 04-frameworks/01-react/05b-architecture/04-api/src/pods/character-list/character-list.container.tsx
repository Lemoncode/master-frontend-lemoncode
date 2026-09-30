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
