import { validateResponse } from "#common/helpers";
import {
  characterDetailSchema,
  type CharacterDetailApiModel,
} from "./character-detail.api-model";

export const getCharacter = async (
  id: string,
): Promise<CharacterDetailApiModel> => {
  const response = await fetch(`/api/characters/${id}`);

  if (response.status === 404) {
    throw new Error("Ese personaje no existe");
  }
  if (!response.ok) {
    throw new Error("El servidor ha contestado con un error");
  }

  return validateResponse(characterDetailSchema, await response.json());
};
