import { getGithubMember } from "./api";
import { mapGithubMemberFromApiToVm } from "./github-member.mapper";
import { GithubMemberVm } from "./github-member.vm";

export const getGithubMemberDetail = async (
  userName: string
): Promise<GithubMemberVm> => {
  const apiGithubMember = await getGithubMember(userName);
  const viewGithubMember = mapGithubMemberFromApiToVm(apiGithubMember);
  return viewGithubMember;
};
