import { io, SocketOptions, Socket, ManagerOptions } from "socket.io-client";

// TODO: Add env variable
export const baseSocketUrl = "http://localhost:3000";

export const createSocket = (): Socket => {
  const url = baseSocketUrl;

  const options: Partial<ManagerOptions & SocketOptions> = {
    timeout: 60000,
  };

  return io(baseSocketUrl, options);
};
