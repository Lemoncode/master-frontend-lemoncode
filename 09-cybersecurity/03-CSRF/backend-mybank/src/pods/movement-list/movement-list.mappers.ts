import * as model from "dals";
import * as apiModel from "./movement-list.api-model";

const mapMovementFromModelToApi = (
  movement: model.Movement
): apiModel.Movement => ({
  id: movement.id,
  description: movement.description,
  amount: movement.amount,
  balance: movement.balance,
  transaction: movement.transaction,
  realTransaction: movement.realTransaction,
  accountId: movement.accountId,
  userId: movement.userId,
});

export const mapMovementListFromModelToApi = (
  movementList: model.Movement[]
): apiModel.Movement[] =>
  Array.isArray(movementList)
    ? movementList.map(mapMovementFromModelToApi)
    : [];
