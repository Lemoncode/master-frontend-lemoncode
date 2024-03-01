interface UserSession {
  connectionId: string;
  nickname: string;
  room: string;
}

export interface ConnectionConfig {
  nickname: string;
  room: string;
}

let userSession = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSession = [...userSession, { connectionId, config }];
};

export const getUserInfo = (connectionId: string): UserSession => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session
    ? {
        connectionId: session.connectionId,
        nickname: session.config.nickname,
        room: session.config.room,
      }
    : { connectionId: -1, nickname: 'ANONYMOUS :-@', room: 'devops' };
};
