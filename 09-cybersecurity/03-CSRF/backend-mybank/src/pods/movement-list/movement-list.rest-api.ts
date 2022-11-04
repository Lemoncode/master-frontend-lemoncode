import { Router } from "express";
import { movementRepository } from "dals";
import { authenticationMiddleware } from "../security/security.middlewares";

export const movementsApi = Router();

movementsApi.get("/:id", authenticationMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const movementList = await movementRepository.getMovementList(id);
    res.send(movementList);
  } catch (error) {
    next(error);
  }
});
