import { combineReducers } from "redux";
import { userProfileReducer, UserProfileState } from "./user-profile.reducer";

export interface State {
  userProfileReducer: UserProfileState;
}

export const reducers = combineReducers<State>({
  userProfileReducer,
});
