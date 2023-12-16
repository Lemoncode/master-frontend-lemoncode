import axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { taskApiCollectionSchema, TaskModel } from "./api.model";

export const getTaskCollection = async (): Promise<TaskModel[]> => {
  const { data } = await axios.get<TaskModel[]>(
    `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`
  );

  const result = taskApiCollectionSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }

  return data ?? [];
};
