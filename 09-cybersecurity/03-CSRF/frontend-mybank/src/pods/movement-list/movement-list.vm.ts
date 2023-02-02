export interface MovementVm {
  id: string;
  description: string;
  amount: number;
  balance: number;
  transaction: string;
  realTransaction: string;
  accountId: string;
  userId: string;
}

export const createEmptyDefaultMovementVm = (): MovementVm => ({
  id: "",
  description: "",
  amount: 0,
  balance: 0,
  transaction: "",
  realTransaction: "",
  accountId: "",
  userId: "",
});
