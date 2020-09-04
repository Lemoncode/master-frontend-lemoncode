// This is just a demo approach, storing in memory session Info
// Another way to identify users: https://stackoverflow.com/questions/6979992/how-to-get-session-id-of-socket-io-client-in-client

interface ConnectSessionInfo {
  room: string;
  trainerToken: string;
  isTrainer: boolean;
}

interface UserSession extends ConnectSessionInfo {
  connectionId: string;
}

let userCollectionSession: UserSession[] = [];

export const isRoomAvailable = (room: string) =>
  !userCollectionSession.find((session) => session.room === room);

export const addNewUser = (
  connectionId: string,
  { room, trainerToken, isTrainer }: ConnectSessionInfo
) => {
  userCollectionSession = [
    ...userCollectionSession,
    {
      connectionId,
      room,
      trainerToken,
      isTrainer,
    },
  ];
};

export const isTrainerUser = (connectionId: string) => {
  const session = userCollectionSession.find(
    (session) => session.connectionId === connectionId && session.isTrainer
  );
  return session;
};

export const isExistingConnection = (connectionId: string) =>
  userCollectionSession.findIndex(
    (session) => session.connectionId === connectionId
  ) !== -1;

export const getRoomFromConnectionId = (connectionId: string) => {
  const session = userCollectionSession.find(
    (session) => session.connectionId === connectionId
  );
  return session ? session.room : '';
};
