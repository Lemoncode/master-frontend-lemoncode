import { LoginCredential } from "./api";

export interface User {
  id: string;
  name: string;
}

export interface AuthContextModel {
  user: User;
  logout: () => Promise<void>;
  login: (loginCredential: LoginCredential) => Promise<void>;
}
