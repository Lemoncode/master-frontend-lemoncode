interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSession: UserSession[] = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSession = [...userSession, { connectionId, nickname: config.nickname }];
  console.log(`New user joined: ${config.nickname}`);
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};