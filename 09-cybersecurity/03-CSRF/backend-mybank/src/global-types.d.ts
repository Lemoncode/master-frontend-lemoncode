declare namespace Express {
  export interface UserSession {
    id: string;
  }

  export interface Request {
    userSession?: UserSession;
  }
}
