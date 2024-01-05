import { z } from "zod";

const GitHubMemberSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().optional(),
  url: z.string(),
  html_url: z.string(),
  name: z.string(),
  bio: z.string(),
  company: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
});

export type GitHubMember = z.infer<typeof GitHubMemberSchema>;

export const validateGithubMember = (data: unknown): boolean => {
  const validationResult = GitHubMemberSchema.safeParse(data);
  if (!validationResult.success) {
    // Se podría usar un logger
    console.warn(
      `La API de Github User ha cambiado: ${validationResult.error}`
    );
  }

  return validationResult.success;
};
