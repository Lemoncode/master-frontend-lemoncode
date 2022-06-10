import * as ioClient from "socket.io-client";
import SocketIOClient, { Socket } from "socket.io";

// TODO: Add env variable
export const baseSocketUrl = "http://localhost:3000";

export interface ConnectionSetup {
  nickname: string;
}

export const createSocket = (connectionSetup: ConnectionSetup): Socket => {
  const { nickname } = connectionSetup;
  const socketParams = {
    url: baseSocketUrl,
    options: {
      query: { nickname },
      timeout: 60000,
    },
  };

  // TODO Add channel (room)
  return ioClient(baseSocketUrl, socketParams.options);
};
