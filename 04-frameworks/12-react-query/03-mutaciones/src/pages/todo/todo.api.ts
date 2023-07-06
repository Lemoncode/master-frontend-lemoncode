import axios from "axios";
import { TodoItem } from "./todo.model";

const __apiUrlBase = "http://localhost:3000";

export const getTodoList = async (): Promise<TodoItem[]> => {
  return axios.get(`${__apiUrlBase}/todos`).then((res) => {
    return res.data;
  });
};

export const appendTodoItem = (item: TodoItem): Promise<TodoItem> => {
  return axios.post(`${__apiUrlBase}/todos`, item).then((res) => {
    return res.data;
  });
};

export const updateTodoItem = (item: TodoItem): Promise<TodoItem> => {
  return axios.put(`${__apiUrlBase}/todos/${item.id}`, item).then((res) => {
    return res.data;
  });
};
