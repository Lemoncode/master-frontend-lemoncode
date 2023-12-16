import { z } from "zod";

export const taskApiSchema = z.object({
  id: z.number(),
  description: z.string(),
  isDone: z.boolean(),
});

// Y para un array de tasks
export const taskApiCollectionSchema = z.array(taskApiSchema);

export type TaskModel = z.infer<typeof taskApiSchema>;
