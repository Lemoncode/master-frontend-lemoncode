import React from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "@/core/routing";
import { GithubMemberPod } from "@/pods";

export const GithubMemberScene: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <GithubMemberPod id={id ?? ""} />
      <Link to={ROUTES.GITHUB_MEMBER_COLLECTION}>
        Back to member collection
      </Link>
    </div>
  );
};
