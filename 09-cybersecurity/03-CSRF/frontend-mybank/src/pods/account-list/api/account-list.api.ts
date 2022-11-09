import { Account } from "./account-list.api-model";

export const getAccountList = async (id: string): Promise<Account[]> => {
  const url = `/api/accounts/${id}`;
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
    throw new Error("Error getting account list");
  }
};
