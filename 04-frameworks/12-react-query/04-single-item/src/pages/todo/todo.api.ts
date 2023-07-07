import axios from "axios";
import { TodoItem } from "./todo.model";
import { url } from "../../core/constants";

export const getTodoList = async (): Promise<TodoItem[]> => {
  return axios.get(`${url}/todos`).then((res) => {
    return res.data;
  });
};

export const appendTodoItem = (item: TodoItem): Promise<TodoItem> => {
  return axios.post(`${url}/todos`, item).then((res) => {
    return res.data;
  });
};

export const updateTodoItem = (item: TodoItem): Promise<TodoItem> => {
  return axios.put(`${url}/todos/${item.id}`, item).then((res) => {
    return res.data;
  });
};
