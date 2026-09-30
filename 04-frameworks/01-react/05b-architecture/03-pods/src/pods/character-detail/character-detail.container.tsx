import React from "react";
import { z } from "zod";
import { Spinner } from "#common/components";
import { CharacterDetailComponent } from "./character-detail.component";
import {
  characterDetailSchema,
  type CharacterDetail,
} from "./character-detail.schema";
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

      fetch(`/api/characters/${id}`)
        .then((response) => {
          if (response.status === 404) {
            throw new Error("Ese personaje no existe");
          }
          if (!response.ok) {
            throw new Error("El servidor ha contestado con un error");
          }

          return response.json();
        })
        .then((data) => {
          const result = characterDetailSchema.safeParse(data);

          if (!result.success) {
            console.error("La API ha cambiado:", z.treeifyError(result.error));
            setError("La respuesta del servidor no tiene el formato esperado");
            return;
          }

          setCharacter(result.data);
        })
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
