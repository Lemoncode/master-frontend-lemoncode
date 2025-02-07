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

const isNicknameUsed = (newUserNickname: string): boolean =>
  userSession.some(session => session.nickname.toLowerCase() === newUserNickname.toLowerCase());

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
): boolean => {
  if (isNicknameUsed(config.nickname)) {
    console.log(`Nickname '${config.nickname}' is already in use`);
    return false;
  } else {
    userSession = [...userSession, { connectionId, config }];
    console.log(`New user joined room '${config.room}': ${config.nickname}`);
    return true;
  }
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
    : { connectionId: '-1', nickname: 'ANONYMOUS :-@', room: 'devops' };
};
