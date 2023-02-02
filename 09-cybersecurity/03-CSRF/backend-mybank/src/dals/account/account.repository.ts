import { Account } from "./account.model";
import { db } from "../mock-data";

export const accountRepository = {
  getAccount: (id: string) => {
    const account: Account[] = db.accountList.filter((a) => a.userId === id);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  },
};
