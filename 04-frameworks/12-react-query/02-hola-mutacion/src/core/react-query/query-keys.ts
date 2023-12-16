const githubModule = "github";
const todoModule = "todo";

export const githubKeys = {
  all: [githubModule] as const,
  members: (org: string) => [...githubKeys.all, "members", org] as const,
  member: (id: string) => [...githubKeys.all, "member", id] as const,
};

export const todoKeys = {
  all: [todoModule] as const,
  todoCollection: () => [...todoKeys.all, "todoCollection"] as const,
};
