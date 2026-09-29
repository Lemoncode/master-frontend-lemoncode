import { Navigate, Outlet } from "react-router";

interface Props {
  isLogged: boolean;
}

export const PrivateRoutes = (props: Props) => {
  const { isLogged } = props;

  return isLogged ? <Outlet /> : <Navigate to="/login" replace />;
};
