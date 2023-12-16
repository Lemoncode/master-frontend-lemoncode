export const githubKeys = {
  all: ["github"] as const,
  members: (org: string) => [...githubKeys.all, "members", org] as const,
  member: (id: string) => [...githubKeys.all, "member", id] as const,
};
