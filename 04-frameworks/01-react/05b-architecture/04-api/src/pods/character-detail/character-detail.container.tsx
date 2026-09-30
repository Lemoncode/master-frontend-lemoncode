import React from "react";
import { Spinner } from "#common/components";
import { getCharacter } from "./api";
import { CharacterDetailComponent } from "./character-detail.component";
import { mapCharacterDetailFromApiToVm } from "./character-detail.mapper";
import type { CharacterDetail } from "./character-detail.vm";
import { CharacterDetailError } from "./components";

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

      getCharacter(id)
        .then((character) =>
          setCharacter(mapCharacterDetailFromApiToVm(character)),
        )
        .catch((error: Error) => setError(error.message))
        .finally(() => setIsLoading(false));
    };

    loadCharacter();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <CharacterDetailError message={error} />;
  }

  if (!character) {
    return null;
  }

  return <CharacterDetailComponent character={character} />;
};
