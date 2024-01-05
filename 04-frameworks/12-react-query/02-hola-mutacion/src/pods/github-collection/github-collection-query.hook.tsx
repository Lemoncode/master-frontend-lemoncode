import { useQuery } from "@tanstack/react-query";
import { getGithubMembersCollection } from "./github-collection.repository";
import { githubKeys } from "@/core/react-query/query-keys";

export const useGithubCollectionQuery = (filter: string) => {
  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: githubKeys.members(filter),
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });

  return { githubMembers, isSuccess, refetch };
};
