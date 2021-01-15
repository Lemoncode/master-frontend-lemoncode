export interface Login {
  user: string;
  password: string;
}

export const createEmptyLogin = (): Login => ({
  user: '',
  password: '',
});
