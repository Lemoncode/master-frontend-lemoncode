import { GitHubMember } from "./api";
import { GithubMemberVm } from "./github-member.vm";

export const mapGithubMemberFromApiToVm = (
  githubMember: GitHubMember
): GithubMemberVm => ({
  id: githubMember.id.toString(),
  login: githubMember.login,
  name: githubMember.name,
  company: githubMember.company,
  avatarUrl: githubMember.avatar_url,
  bio: githubMember.bio,
});
