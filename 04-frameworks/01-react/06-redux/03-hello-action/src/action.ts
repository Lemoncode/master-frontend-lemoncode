import { actionsIds } from "./common/action-id";

export const updateUserProfileName = (newName: string) => ({
  type: actionsIds.UPDATE_USERPROFILE_NAME,
  payload: newName,
});
