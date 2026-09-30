import { Navigate, Outlet } from "react-router";
import { Spinner } from "#common/components";
import { useAuth } from "#core/auth";
import { CenterLayout } from "#layouts";
import { ROUTES } from "./routes";

export const PrivateRoutes = () => {
  const { userSession, isChecking } = useAuth();

  if (isChecking) {
    return (
      <CenterLayout>
        <Spinner />
      </CenterLayout>
    );
  }

  return userSession ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
