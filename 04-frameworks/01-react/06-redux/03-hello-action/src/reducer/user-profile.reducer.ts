import { actionsIds } from "../common/action-id";

export interface UserProfileState {
  firstname: string;
}

const defaultUserState = (): UserProfileState => ({
  firstname: "John Doe",
});

export const userProfileReducer = (state = defaultUserState(), action) => {
  // Later on we will have a switch statement to replace state on changes.
  switch (action.type) {
    case actionsIds.UPDATE_USERPROFILE_NAME:
      return handleUserProfileAction(state, action.payload);
  }
  return state;
};

const handleUserProfileAction = (state: UserProfileState, firstname) => {
  return {
    ...state,
    firstname,
  };
};
