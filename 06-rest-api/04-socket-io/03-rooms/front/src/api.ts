import { io, SocketOptions, Socket, ManagerOptions } from "socket.io-client";

// TODO: Add env variable
const baseSocketUrl = "http://localhost:3000";

export interface SocketQuery {
  nickname: string;
  room: string;
}

export const createSocket = (query: SocketQuery): Socket => {
  const options: Partial<ManagerOptions & SocketOptions> = {
    query,
    timeout: 60000,
  };

  return io(baseSocketUrl, options);
};
