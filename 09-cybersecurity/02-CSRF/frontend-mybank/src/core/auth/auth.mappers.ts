import * as apiModel from "./api";
import * as viewModel from "./auth.model";

export const mapUserToVM = (user: apiModel.User): viewModel.User => ({
  id: user.id,
  name: user.name,
});
