import { Navigate, Outlet } from "react-router";
import { useAuth } from "#core/auth";
import { ROUTES } from "./routes";

export const PrivateRoutes = () => {
  const { userSession, isChecking } = useAuth();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return userSession ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
