export type Mode = "Readonly" | "Append" | "Edit";

export interface TodoVm {
  id: number;
  description: string;
  isDone: boolean;
}

export const createEmptyTodoItem = (): TodoVm => ({
  id: 0,
  description: "",
  isDone: false,
});
