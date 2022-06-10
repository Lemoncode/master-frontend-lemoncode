export interface UserProfileState {
  firstname: string;
}

const defaultUserState = (): UserProfileState => ({
  firstname: "John Doe",
});

export const userProfileReducer = (state = defaultUserState(), action) => {
  // Later on we will have a switch statement to replace state on changes.
  return state;
};
