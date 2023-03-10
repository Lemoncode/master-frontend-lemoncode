interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSessions: UserSession[] = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSessions = [...userSessions, { connectionId, nickname: config.nickname }];
};

export const getNickname = (connectionId: string) => {
  const session = userSessions.find(
    (session) => session.connectionId === connectionId
  );

  return session && session.nickname !== "" ? session.nickname : 'ANONYMOUS :-@';
};
