export interface UserSession {
  userName: string;
}

export const createEmptyUserSession = (): UserSession => ({
  userName: '',
});
