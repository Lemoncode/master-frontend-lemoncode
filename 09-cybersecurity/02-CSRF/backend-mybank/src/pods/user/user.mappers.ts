import * as model from "dals/user/user.model";
import * as apiModel from "./user.api-model";

export const mapUserFromModelToApi = (user: model.User): apiModel.User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  password: user.password,
});

export const mapUserListFromModelToApi = (
  userList: model.User[]
): apiModel.User[] =>
  Array.isArray(userList) ? userList.map(mapUserFromModelToApi) : [];
