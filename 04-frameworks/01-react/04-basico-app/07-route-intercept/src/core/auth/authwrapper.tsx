import React from "react";
import { Route, RouteProps, useNavigate } from "react-router-dom";
import { AuthContext } from "./authcontext";

export const AuthWrapperComponent: React.FunctionComponent<RouteProps> = (
  props
) => {
  const { userInfo } = React.useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [props.path]);

  return <>{props.children}</>;
};
