import Axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { GitHubMember, validateGithubMember } from "./github-member.model";

export const getGithubMember = async (
  userName: string
): Promise<GitHubMember> => {
  const { data } = await Axios.get<GitHubMember>(
    `${ENV_VARIABLES.GITHUB_API_BASE_URL}/users/${userName}`
  );

  validateGithubMember(data);

  return data;
};
