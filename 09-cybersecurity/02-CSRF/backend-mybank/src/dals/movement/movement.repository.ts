import { db } from "../mock-data";

export const movementRepository = {
  getMovementList: async (id: string) => {
    return db.movementList.filter((movement) => movement.accountId === id);
  },
};
