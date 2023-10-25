import * as apiModel from "./api";
import * as viewModel from "./movement-list.vm";

const mapMovementFromApiToVm = (
  movement: apiModel.Movement
): viewModel.MovementVm => ({
  id: movement.id,
  description: movement.description,
  amount: movement.amount,
  balance: movement.balance,
  transaction: movement.transaction,
  realTransaction: movement.realTransaction,
  accountId: movement.accountId,
  userId: movement.userId,
});

export const mapMovementListFromApiToVm = (
  movementList: apiModel.Movement[]
): viewModel.MovementVm[] =>
  Array.isArray(movementList) ? movementList.map(mapMovementFromApiToVm) : [];
