interface UserSession {
  connectionId: string;
  nickname: string;
}

let userSession = [];

export const addUserSession = (connectionId: string, nickname) => {
  userSession = [...userSession, { connectionId, nickname }];
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : 'ANONYMOUS :-@';
};
