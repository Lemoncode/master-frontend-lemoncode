import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";

export const DashboardScene: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>Ir miembros Github</Link>
      </div>
      <br />
      <div>
        <Link to={ROUTES.TODOS}>Ir listado TODO's</Link>
      </div>
    </div>
  );
};
