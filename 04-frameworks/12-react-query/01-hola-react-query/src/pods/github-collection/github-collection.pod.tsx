import React from "react";
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { useOrganizationFilterContext } from "./providers";
import { useGithubCollectionQuery } from "./github-collection-query.hook";
import { queryClient } from "@/core/react-query";
import { githubKeys } from "@/core/react-query/query-keys";

export const GithubCollectionPod: React.FC = () => {
  const { filter, setFilter } = useOrganizationFilterContext();

  const { githubMembers, refetch } = useGithubCollectionQuery(filter);

  return (
    <div>
      <button onClick={() => refetch()}>Refrescar</button>
      <button
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: githubKeys.all })
        }
      >
        Invalidar todas las consultas de github
      </button>
      <FilterComponent
        initialValue={filter}
        onSearch={(value) => setFilter(value)}
      />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
