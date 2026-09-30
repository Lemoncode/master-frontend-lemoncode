import React from "react";
import { Link, generatePath, useParams } from "react-router";
import { ROUTES } from "#core/router";
import { characterDetailSchema, type CharacterDetail } from "#character.schema";
import z from "zod";
import { EpisodeTable } from "#episode-table";

export const CharacterDetailScene = () => {
  const { id } = useParams<{ id: string }>();
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
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>

        <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!character) {
    return null;
  }

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
