import { Link } from "react-router";
import { ErrorMessage } from "#common/components";
import { ROUTES } from "#core/router";

interface Props {
  message: string;
}

export const CharacterDetailError = (props: Props) => {
  const { message } = props;

  return (
    <div className="flex flex-col items-start gap-4">
      <ErrorMessage message={message} />

      <Link className="btn btn-primary" to={ROUTES.CHARACTERS}>
        Volver al listado
      </Link>
    </div>
  );
};
