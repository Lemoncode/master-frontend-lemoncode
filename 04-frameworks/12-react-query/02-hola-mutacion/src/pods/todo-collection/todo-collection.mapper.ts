import * as apiModel from "./api/api.model";
import * as vm from "./todo-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TodoVm => ({
  ...task,
});
