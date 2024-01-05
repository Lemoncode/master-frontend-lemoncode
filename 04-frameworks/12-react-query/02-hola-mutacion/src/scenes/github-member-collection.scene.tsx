import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import { GithubCollectionPod } from "@/pods";

export const GithubMemberCollectionScene: React.FC = () => {
  return (
    <div>
      <h1>Github Member Collection</h1>
      <GithubCollectionPod />
      <Link to={ROUTES.HOME}>Volver a home</Link>
    </div>
  );
};
