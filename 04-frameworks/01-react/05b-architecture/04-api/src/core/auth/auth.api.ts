import type { UserSession } from "./auth.vm";

export const getUserSession = async (): Promise<UserSession | null> => {
  const response = await fetch("/api/me");

  return response.ok ? response.json() : null;
};

export const logout = async (): Promise<void> => {
  await fetch("/api/logout", { method: "POST" });
};
