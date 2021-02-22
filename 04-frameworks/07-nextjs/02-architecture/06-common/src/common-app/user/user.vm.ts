export interface UserCredential {
  email: string;
  password: string;
}

export const createEmptyUserCredential = (): UserCredential => ({
  email: '',
  password: '',
});
