export interface Login {
  username: string;
  password: string;
}

export const createEmptyLogin = (): Login => ({
  username: "",
  password: "",
});
