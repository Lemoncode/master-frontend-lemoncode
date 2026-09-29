import { Navigate, Outlet } from "react-router";

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

  return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
};
