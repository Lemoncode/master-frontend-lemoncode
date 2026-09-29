import { Link } from "react-router";
import type { Character } from "./character-list";

interface Props {
  character: Character;
}

const statusColor: Record<Character["status"], string> = {
  Alive: "badge-success",
  Dead: "badge-error",
  unknown: "badge-ghost",
};

export const CharacterCard = (props: Props) => {
  const { character } = props;

  return (
    <Link
      className="card bg-base-100 border-base-300 border transition hover:-translate-y-1 hover:shadow-lg"
      to={`/characters/${character.id}`}
    >
      <figure>
        <img src={character.image} alt={character.name} />
      </figure>

      <div className="card-body gap-2 p-4">
        <h3 className="card-title text-base">{character.name}</h3>
        <span className={`badge badge-sm ${statusColor[character.status]}`}>
          {character.status}
        </span>
        <span className="text-sm opacity-60">{character.species}</span>
      </div>
    </Link>
  );
};
