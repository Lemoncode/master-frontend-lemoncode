export interface GithubMemberVm {
  id: string;
  login: string;
  name: string;
  company: string;
  avatarUrl: string;
  bio: string;
}

export const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
  name: "",
  company: "",
  avatarUrl: "",
  bio: "",
});
