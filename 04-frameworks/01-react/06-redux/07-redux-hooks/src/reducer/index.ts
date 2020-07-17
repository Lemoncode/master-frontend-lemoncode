import { combineReducers } from "redux";
import { userProfileReducer, UserProfileState } from "./user-profile.reducer";
import { memberReducer, memberState } from "./member-reducer";

export interface State {
  userProfileReducer: UserProfileState;
  memberReducer: memberState;
}

export const reducers = combineReducers<State>({
  userProfileReducer,
  memberReducer,
});
