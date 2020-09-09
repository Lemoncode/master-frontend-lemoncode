export interface User {
  id: string;
  userName: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface UserSession {
  firstname: string;
  lastname: string;
  token: string;
}
