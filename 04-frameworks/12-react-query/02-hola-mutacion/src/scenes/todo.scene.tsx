import { ROUTES } from "@/core/routing";
import { TodoCollectionPod } from "@/pods";
import React from "react";
import { Link } from "react-router-dom";

export const TODOScene: React.FC = () => {
  return (
    <div>
      <TodoCollectionPod />
      <Link to={ROUTES.HOME}>Volver a home</Link>
    </div>
  );
};
