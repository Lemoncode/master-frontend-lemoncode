import { EditEmailResponse } from "./edit-email.api-model";

export const editEmail = async (newEmail: string): Promise<EditEmailResponse> => {
  const url = "/api/security/edit";
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: newEmail,
    }),
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Error changing email");
  }
};
