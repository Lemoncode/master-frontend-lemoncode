import React from "react";
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { GithubMemberVm } from "./github-collection.vm";
import { getGithubMembersCollection } from "./github-collection.repository";

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");
  const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm[]>(
    []
  );

  const loadGithubMembers = async (filter: string) => {
    if (filter) {
      const membersCollection = await getGithubMembersCollection(filter);
      setGithubMembers(membersCollection);
    }
  };

  React.useEffect(() => {
    loadGithubMembers(filter);
  }, [filter]);

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
