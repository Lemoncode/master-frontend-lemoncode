interface UserSession {
  connectionId: string;
  nickname: string;
  room: string;
}

let userSession = [];

export const addUserSession = (
  connectionId: string,
  nickname: string,
  room: string
) => {
  userSession = [...userSession, { connectionId, nickname, room }];
};

export const getUserInfo = (connectionId: string): UserSession => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session
    ? session
    : { id: -1, nickname: 'ANONYMOUS :-@', room: 'devops' };
};
