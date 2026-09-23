interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSession: UserSession[] = [];

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
    userSession = [...userSession, { connectionId, nickname: config.nickname }];
    console.log(`New user joined: ${config.nickname}`);
    return true;
  }
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};