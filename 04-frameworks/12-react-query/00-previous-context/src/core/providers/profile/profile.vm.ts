export interface UserProfile {
  userName: string;
}

export const createEmptyUserProfile = (): UserProfile => ({
  userName: "",
});
