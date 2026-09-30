import { validateResponse } from "#common/helpers";
import {
  characterPageSchema,
  type CharacterPageApiModel,
} from "./character-list.api-model";

export const getCharacterPage = async (): Promise<CharacterPageApiModel> => {
  const response = await fetch("/api/characters");

  if (!response.ok) {
    throw new Error("No se han podido cargar los personajes");
  }

  return validateResponse(characterPageSchema, await response.json());
};
