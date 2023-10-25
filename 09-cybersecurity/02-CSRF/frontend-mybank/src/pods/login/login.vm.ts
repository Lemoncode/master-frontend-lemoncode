export interface Credential {
  email: string;
  password: string;
}

export const createEmptyCredential = (): Credential => ({
  email: '',
  password: '',
});