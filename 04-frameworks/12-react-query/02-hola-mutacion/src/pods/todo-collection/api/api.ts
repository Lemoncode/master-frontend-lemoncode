import axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { todoApiCollectionSchema, TodoModel } from "./api.model";

export const getTaskCollection = async (): Promise<TodoModel[]> => {
  const { data } = await axios.get<TodoModel[]>(
    `${ENV_VARIABLES.TODO_API_BASE_URL}/todos`
  );

  const result = todoApiCollectionSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }

  return data ?? [];
};

export const insertTodo = async (todo: TodoModel): Promise<TodoModel> => {
  const { data } = await axios.post<TodoModel>(
    `${ENV_VARIABLES.TODO_API_BASE_URL}/todos`,
    todo
  );

  return data;
};

export const updateTodo = async (todo: TodoModel): Promise<TodoModel> => {
  const { data } = await axios.put<TodoModel>(
    `${ENV_VARIABLES.TODO_API_BASE_URL}/todos/${todo.id}`,
    todo
  );

  return data;
};
