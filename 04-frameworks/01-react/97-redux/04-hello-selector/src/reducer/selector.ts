import { createSelector } from "reselect";
import { State } from "./index"; // This is not a good idea because it could create a circular reference, but we'll leave it like that for now
import { UserProfileState } from "./user-profile.reducer";

// To be able to access state.memberListReducer from a different path in case the app grows and we need to relocate our reducer.
export const getUserProfileReducer = (state: State) => state.userProfileReducer;

export const getFullname = createSelector(
  getUserProfileReducer,
  (userProfileReducer) =>
    `${userProfileReducer.firstname} ${userProfileReducer.lastname}`
);
