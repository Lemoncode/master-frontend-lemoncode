import type * as apiModel from "./api";
import type * as viewModel from "./character-list.vm";

const mapCharacterFromApiToVm = (
  character: apiModel.CharacterApiModel,
): viewModel.Character => ({
  id: character.id,
  name: character.name,
  status: character.status,
  species: character.species,
  image: character.image,
});

export const mapCharacterListFromApiToVm = (
  characterPage: apiModel.CharacterPageApiModel,
): viewModel.Character[] =>
  characterPage.results
    ? characterPage.results.map(mapCharacterFromApiToVm)
    : [];
