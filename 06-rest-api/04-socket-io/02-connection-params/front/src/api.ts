import ioClient from "socket.io-client";

// TODO: Add env variable
export const baseSocketUrl = "http://localhost:3000";

export const createSocket = (): globalThis.SocketIOClient.Socket => {
  const socketParams = {
    url: baseSocketUrl,
    options: {
      timeout: 60000,
    },
  };

  return ioClient(baseSocketUrl, socketParams.options);
};
