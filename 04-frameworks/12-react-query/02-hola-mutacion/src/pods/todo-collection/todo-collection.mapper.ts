import * as apiModel from "./api/api.model";
import * as vm from "./todo-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TodoModel): vm.TodoVm => ({
  ...task,
});

export const mapTodoFromVmToApi = (task: vm.TodoVm): apiModel.TodoModel => ({
  ...task,
});
