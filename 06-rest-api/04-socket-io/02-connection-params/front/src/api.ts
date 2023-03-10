import { io, SocketOptions, Socket, ManagerOptions } from "socket.io-client";

// TODO: Add env variable
const baseSocketUrl = "http://localhost:3000";

export const createSocket = (nickname: string): Socket => {
  const options: Partial<ManagerOptions & SocketOptions> = {
    query: {nickname},
    timeout: 60000,
  };

  return io(baseSocketUrl, options);
};
