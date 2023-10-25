import { Movement } from "./movement-list.api-model";

export const getMovementList = async (
  id: string,
): Promise<Movement[]> => {
  const url = `/api/movements/${id}`;
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
    throw new Error("Error getting movement list");
  }
};
