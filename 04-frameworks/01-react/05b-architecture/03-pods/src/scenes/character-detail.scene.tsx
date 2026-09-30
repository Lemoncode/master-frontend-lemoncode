import { useParams } from "react-router";
import { CharacterDetailContainer } from "#pods/character-detail";

export const CharacterDetailScene = () => {
  const { id } = useParams<{ id: string }>();

  return <CharacterDetailContainer id={id ?? ""} />;
};
