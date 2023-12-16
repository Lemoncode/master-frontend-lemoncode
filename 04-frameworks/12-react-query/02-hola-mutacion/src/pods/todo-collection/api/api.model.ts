import { z } from "zod";

export const todoApiSchema = z.object({
  id: z.number(),
  description: z.string(),
  isDone: z.boolean(),
});

// Y para un array de tasks
export const todoApiCollectionSchema = z.array(todoApiSchema);

export type TodoModel = z.infer<typeof todoApiSchema>;
