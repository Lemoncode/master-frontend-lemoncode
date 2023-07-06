export const ReadOnlyMode = -1;
export const AppendMode = 0;

export interface TodoItem {
  id: number;
  description: string;
  isDone: boolean;
}

export const createEmptyTodoItem = (): TodoItem => ({
  id: 0,
  description: "",
  isDone: false,
});
