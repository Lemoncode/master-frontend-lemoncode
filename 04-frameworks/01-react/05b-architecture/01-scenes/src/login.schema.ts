import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(4, "La contraseña necesita al menos 4 caracteres"),
});

export type Credentials = z.infer<typeof loginSchema>;
