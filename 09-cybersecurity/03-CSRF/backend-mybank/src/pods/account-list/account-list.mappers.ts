import * as model from "dals";
import * as apiModel from "./account-list.api-model";

const mapAccountFromModelToApi = (
  account: model.Account
): apiModel.Account => ({
  id: account.id,
  iban: account.iban,
  type: account.type,
  name: account.name,
  balance: account.balance,
  lastTransaction: account.lastTransaction,
  alias: account.alias,
});

export const mapAccountListFromModelToApi = (
  accountList: model.Account[]
): apiModel.Account[] =>
  Array.isArray(accountList) ? accountList.map(mapAccountFromModelToApi) : [];
