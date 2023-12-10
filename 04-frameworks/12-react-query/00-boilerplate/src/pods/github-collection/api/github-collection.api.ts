import Axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import {
  GithubMemberApiModel,
  validateGithubMember,
} from "./github-collection.model";

export const getGithubMembers = async (
  organization: string
): Promise<GithubMemberApiModel[]> => {
  const { data } = await Axios.get<GithubMemberApiModel[]>(
    `${ENV_VARIABLES.GITHUB_API_BASE_URL}/orgs/${organization}/members`
  );

  validateGithubMember(data);

  return data;
};
