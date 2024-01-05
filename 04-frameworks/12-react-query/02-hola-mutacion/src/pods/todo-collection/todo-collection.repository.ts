import * as apiModel from "./api/api.model";
import {
  mapTaskFromApiToVm as mapTodoFromApiToVm,
  mapTodoFromVmToApi,
} from "./todo-collection.mapper";
import * as vm from "./todo-collection.vm";
import {
  getTaskCollection as getTaskCollecionApi,
  insertTodo as insertTodoApi,
  updateTodo as updateTodoApi,
} from "./api/api";

export const getTodoCollection = async (): Promise<vm.TodoVm[]> => {
  const apiTaskCollection: apiModel.TodoModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTodoFromApiToVm);
};

export const insertTodo = async (task: vm.TodoVm): Promise<vm.TodoVm> => {
  const apiTask = mapTodoFromVmToApi(task);
  const insertedTodo = await insertTodoApi(apiTask);
  return mapTodoFromApiToVm(insertedTodo);
};

export const updateTodo = async (todo: vm.TodoVm): Promise<vm.TodoVm> => {
  const apiTodo = mapTodoFromVmToApi(todo);
  const updatedTodo = await updateTodoApi(apiTodo);
  return mapTodoFromApiToVm(updatedTodo);
};
