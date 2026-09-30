import { CharacterCard } from "./components";
import type { Character } from "./character-list.vm";

interface Props {
  characters: Character[];
}

export const CharacterListComponent = (props: Props) => {
  const { characters } = props;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
};
