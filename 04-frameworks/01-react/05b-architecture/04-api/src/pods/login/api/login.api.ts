import type { UserSession } from "#core/auth";
import type { Credentials } from "../login.schema";

export const login = async (credentials: Credentials): Promise<UserSession> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).catch(() => {
    throw new Error("No se ha podido conectar con el servidor");
  });
  const data = await response.json().catch(() => {
    throw new Error("No se ha podido conectar con el servidor");
  });

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
