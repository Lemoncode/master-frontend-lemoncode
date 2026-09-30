import { z } from "zod";

export const validateResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("La API ha cambiado:", z.treeifyError(result.error));
    throw new Error("La respuesta del servidor no tiene el formato esperado");
  }

  return result.data;
};
