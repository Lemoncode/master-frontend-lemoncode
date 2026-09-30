import { Navigate, Outlet } from "react-router";
import { ROUTES } from "./routes";

interface Props {
  isLogged: boolean;
  isChecking: boolean;
}

export const PrivateRoutes = (props: Props) => {
  const { isLogged, isChecking } = props;

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return isLogged ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
