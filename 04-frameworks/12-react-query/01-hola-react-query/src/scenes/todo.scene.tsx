import { ROUTES } from "@/core/routing";
import React from "react";
import { Link } from "react-router-dom";

export const TODOScene: React.FC = () => {
  return (
    <div>
      <h1>TODOS Scene</h1>
      <Link to={ROUTES.HOME}>Volver a home</Link>
    </div>
  );
};
