import { LoginCredential, User } from "./auth.api-model";

export const doLogin = async (
  loginCredential: LoginCredential
): Promise<boolean> => {
  const url = "/api/security/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginCredential),
  });
  return response.ok;
};

export const doLogout = async (): Promise<boolean> => {
  const url = "/api/security/logout";
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return response.ok;
};

export const getCurrentUser = async (): Promise<User> => {
  const url = "/api/security/current-user";
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Error getting current user");
  }
};
