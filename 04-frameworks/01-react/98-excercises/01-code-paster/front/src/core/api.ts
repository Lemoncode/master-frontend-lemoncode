import * as ioClient from 'socket.io-client';
import { baseSocketUrl } from './const';
import SocketIOClient, { Socket } from 'socket.io';

export interface ConnectionSetup {
  room: string;
  trainertoken: string;
}

export const createSocket = (connectionSetup: ConnectionSetup): Socket => {
  const { room, trainertoken } = connectionSetup;
  const socketParams = {
    url: baseSocketUrl,
    options: {
      query: { room, trainertoken },
      timeout: 60000,
    },
  };

  // TODO Add channel (room)
  return ioClient(baseSocketUrl, socketParams.options);
};
