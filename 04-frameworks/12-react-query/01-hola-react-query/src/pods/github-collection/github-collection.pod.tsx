import React from "react";
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { getGithubMembersCollection } from "./github-collection.repository";
import { useQuery } from "@tanstack/react-query";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: !!filter,
  });

  return (
    <div>
      <FilterComponent
        initialValue={filter}
        onSearch={(value) => setFilter(value)}
      />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};
