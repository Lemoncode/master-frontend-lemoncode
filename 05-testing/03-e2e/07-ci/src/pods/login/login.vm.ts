export interface Login {
  name: string;
  password: string;
}

export const createEmptyLogin = (): Login => ({
  name: '',
  password: '',
});
