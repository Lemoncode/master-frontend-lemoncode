interface UserSession {
  connectionId: string;
  nickname: string;
  room: string;
}

export interface ConnectionConfig {
  nickname: string;
  room: string;
}

let userSessions: UserSession[] = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSessions = [...userSessions, {
    connectionId,
    nickname: config.nickname,
    room: config.room,
  }];
};

export const getUserInfo = (connectionId: string): UserSession => {
  const session = userSessions.find(
    (session) => session.connectionId === connectionId
  );

  return session && session.nickname !== ""
    ? {
        connectionId: session.connectionId,
        nickname: session.nickname,
        room: session.room,
      }
    : { connectionId: '-1', nickname: 'ANONYMOUS :-@', room: 'devops' };
};
