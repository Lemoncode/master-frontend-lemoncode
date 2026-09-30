import { Link, generatePath } from "react-router";
import { ROUTES } from "#core/router";
import type { CharacterDetail } from "./character-detail.schema";
import { EpisodeTable } from "./components";

interface Props {
  character: CharacterDetail;
}

export const CharacterDetailComponent = (props: Props) => {
  const { character } = props;

  return (
    <div className="flex flex-col gap-6">
      <Link className="btn btn-ghost w-fit" to={ROUTES.CHARACTERS}>
        ← Volver al listado
      </Link>

      <div className="join">
        {character.id > 1 && (
          <Link
            className="btn join-item"
            to={generatePath(ROUTES.CHARACTER_DETAIL, {
              id: String(character.id - 1),
            })}
          >
            Anterior
          </Link>
        )}

        <Link
          className="btn join-item"
          to={generatePath(ROUTES.CHARACTER_DETAIL, {
            id: String(character.id + 1),
          })}
        >
          Siguiente
        </Link>
      </div>

      <div className="card bg-base-100 border-base-300 sm:card-side border">
        <figure className="sm:w-64 sm:shrink-0">
          <img
            className="h-full w-full object-cover"
            src={character.image}
            alt={character.name}
          />
        </figure>

        <div className="card-body gap-4">
          <h2 className="card-title text-3xl">{character.name}</h2>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-lg badge-primary">
              {character.species}
            </span>
            <span className="badge badge-lg badge-ghost">
              {character.gender}
            </span>
            <span className="badge badge-lg badge-ghost">
              {character.status}
            </span>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm opacity-60">Origen</dt>
              <dd className="font-semibold">{character.origin}</dd>
            </div>

            <div>
              <dt className="text-sm opacity-60">Última ubicación</dt>
              <dd className="font-semibold">{character.location}</dd>
            </div>

            <div>
              <dt className="text-sm opacity-60">Episodios</dt>
              <dd className="font-semibold">{character.episodeCount}</dd>
            </div>
          </dl>
        </div>
      </div>
      <EpisodeTable episodes={character.episodes} />
    </div>
  );
};
