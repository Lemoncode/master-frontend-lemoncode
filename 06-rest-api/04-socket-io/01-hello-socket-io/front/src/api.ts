import ioClient from "socket.io-client";

// TODO: Add env variable
export const baseSocketUrl = "http://localhost:3000";

export const createSocket = (): globalThis.SocketIOClient.Socket => {
  const url = baseSocketUrl;

  const options: SocketIOClient.ConnectOpts = {
    timeout: 60000,
  };

  return ioClient(baseSocketUrl, options);
};
