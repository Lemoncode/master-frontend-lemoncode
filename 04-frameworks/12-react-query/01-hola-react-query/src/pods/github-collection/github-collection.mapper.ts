import { GithubMemberApiModel } from "./api";
import { GithubMemberVm } from "./github-collection.vm";

export const mapGithubMemberFromApiToVm = (
  githubMember: GithubMemberApiModel
): GithubMemberVm => ({
  id: githubMember.id.toString(),
  name: githubMember.login,
  avatarUrl: githubMember.avatar_url,
});
