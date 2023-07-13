export const todoKeys = {
  all: ["todo"] as const,
  todoList: () => [...todoKeys.all, "todoList"] as const,
  todoItem: () => [...todoKeys.all, "todoItem"] as const,
};
