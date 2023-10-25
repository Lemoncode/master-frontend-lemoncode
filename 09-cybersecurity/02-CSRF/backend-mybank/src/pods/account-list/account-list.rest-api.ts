import { Router } from "express";
import { accountRepository } from "dals";
import { mapAccountListFromModelToApi } from "./account-list.mappers";
import { authenticationMiddleware } from "../security/security.middlewares";

export const accountsApi = Router();

accountsApi.get("/:id", authenticationMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountRepository.getAccount(id);
    res.send(mapAccountListFromModelToApi(account));
  } catch (error) {
    next(error);
  }
});
