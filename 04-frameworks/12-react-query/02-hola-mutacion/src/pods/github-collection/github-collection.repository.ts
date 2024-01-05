import { getGithubMembers } from "./api/github-collection.api";
import { mapGithubMemberFromApiToVm } from "./github-collection.mapper";
import { GithubMemberVm } from "./github-collection.vm";

export const getGithubMembersCollection = async (
  organization: string
): Promise<GithubMemberVm[]> => {
  const apiGithubMembers = await getGithubMembers(organization);
  const viewGithubMembers = apiGithubMembers.map((apiGithubMember) =>
    mapGithubMemberFromApiToVm(apiGithubMember)
  );
  return viewGithubMembers;
};
