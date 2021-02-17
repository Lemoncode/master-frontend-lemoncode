import ioClient from "socket.io-client";

// TODO: Add env variable
export const baseSocketUrl = "http://localhost:3000";

export const createSocket = (
  nickname: string,
  room: string
): globalThis.SocketIOClient.Socket => {
  const url = baseSocketUrl;

  const options: SocketIOClient.ConnectOpts = {
    query: `nickname=${nickname}&room=${room}`,
    timeout: 60000,
    transports: ["websocket"],
  };

  return ioClient(baseSocketUrl, options);
};
