import { z } from "zod";

// Definiendo el esquema Zod para la entidad
const GithubMemberSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().optional(),
  url: z.string(),
  html_url: z.string(),
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

const GithubMembersArraySchema = z.array(GithubMemberSchema);

// Inferir la interfaz TypeScript desde el esquema Zod
export type GithubMemberApiModel = z.infer<typeof GithubMemberSchema>;

// Se podría mirar de hacer algo genérico con esto
export const validateGithubMember = (data: unknown): boolean => {
  const validationResult = GithubMembersArraySchema.safeParse(data);
  if (!validationResult.success) {
    // Se podría usar un logger
    console.warn(
      `La API de Github Member ha cambiado: ${validationResult.error}`
    );
  }

  return validationResult.success;
};
