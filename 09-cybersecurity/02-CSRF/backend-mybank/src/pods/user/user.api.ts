import { Router } from "express";
import {
  mapUserFromModelToApi,
  mapUserListFromModelToApi,
} from "./user.mappers";
import { userRepository } from "dals";

export const userApi = Router();

userApi.get("/", async (req, res) => {
  const userList = await userRepository.getUserList();
  res.send(mapUserListFromModelToApi(userList));
});

userApi.get("/:id", async (req, res) => {
  const user = await userRepository.getUser(req.params.id);
  res.send(mapUserFromModelToApi(user));
});
