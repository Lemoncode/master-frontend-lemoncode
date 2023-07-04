import axios from "axios";
import { TodoItem } from "./todo.model";
import { url } from "../../core/constants";

export const getTodoItem = (id: string): Promise<TodoItem> => {
  return axios
    .get<TodoItem>(`${url}/todos/${id}`)
    .then((response) => response.data);
};
