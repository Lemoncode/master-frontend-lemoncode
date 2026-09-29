import { Link, useParams } from "react-router";

export const CharacterDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold">Detalle del personaje</h2>
      <h3>Id: {id}</h3>
      <Link className="btn btn-primary" to="/characters">
        Volver al listado
      </Link>
    </div>
  );
};
