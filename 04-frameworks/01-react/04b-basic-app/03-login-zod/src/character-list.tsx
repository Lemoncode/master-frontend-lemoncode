import { Link } from "react-router";

export const CharacterListPage = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-2xl font-bold">Personajes</h2>
      <Link className="btn btn-primary" to="/characters/2">
        Ver el detalle de Morty
      </Link>
    </div>
  );
};
