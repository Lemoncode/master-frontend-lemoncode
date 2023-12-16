import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm } from "./todo-collection.mapper";
import * as vm from "./todo-collection.vm";
import { getTaskCollection as getTaskCollecionApi } from "./api/api";

export const getTodoCollection = async (): Promise<vm.TodoVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};
