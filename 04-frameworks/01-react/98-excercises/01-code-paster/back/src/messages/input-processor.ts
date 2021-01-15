import { InputMessageTypes, OutputMessageTypes } from './consts';
import {
  Action,
  InputEstablishConnectionMaster,
  InputEstablishConnectionPlayer,
  SocketInfo,
} from './model';
import {
  isTrainerUser,
  getRoomFromConnectionId,
  isExistingConnection,
  isRoomAvailable,
  addNewUser,
} from '../storage';
import { processOuputMessage } from './output-processor';

export const processInputMessage = (
  socketInfo: SocketInfo,
  action: Action
): Action[] => {
  let outputActionCollection: Action[] = [];
  switch (action.type) {
    case InputMessageTypes.ESTABLISH_CONNECTION_TRAINER:
      const payloadECT: InputEstablishConnectionMaster = action.payload;
      outputActionCollection = handleEstablishConnectionTrainer(
        socketInfo,
        payloadECT.room,
        payloadECT.trainertoken
      );
      break;
    case InputMessageTypes.ESTABLISH_CONNECTION_STUDENT:
      const payloadECS: InputEstablishConnectionMaster = action.payload;
      outputActionCollection = handleEstablishConnectionStudent(
        socketInfo,
        payloadECS.room
      );
      break;
    case InputMessageTypes.TRAINER_APPEND_TEXT:
      outputActionCollection = handleTrainerAppendText(
        socketInfo,
        action.payload
      );
      break;
    case InputMessageTypes.TRAINER_SET_FULL_TEXT:
      outputActionCollection = handleSetTrainerFullText(
        socketInfo,
        action.payload
      );
      break;
  }

  return outputActionCollection;
};

const handleSetTrainerFullText = (socketInfo: SocketInfo, text: string) => {
  if (!isTrainerUser(socketInfo.connectionId)) {
    return [];
  }

  return [{ type: OutputMessageTypes.REPLACE_FULL_TEXT, payload: text }];
};

const handleTrainerAppendText = (socketInfo: SocketInfo, text: string) => {
  if (!isTrainerUser(socketInfo.connectionId)) {
    return [];
  }

  return [{ type: OutputMessageTypes.APPEND_TEXT, payload: text }];
};

const handleEstablishConnectionStudent = (
  socketInfo: SocketInfo,
  room: string
) => {
  if (!room) {
    // Ignore
    return [];
  }

  if (isRoomAvailable(room) || !isExistingConnection(socketInfo.connectionId)) {
    addNewUser(socketInfo.connectionId, {
      room,
      trainerToken: '',
      isTrainer: false,
    });
    socketInfo.socket.join(room);
  }
  return [{ type: OutputMessageTypes.CONNECTION_ESTABLISHED_STUDENT }];
};

const handleEstablishConnectionTrainer = (
  socketInfo: SocketInfo,
  room: string,
  trainerToken: string
): Action[] => {
  if (!trainerToken || !room) {
    // Ignore
    return [];
  }

  if (isRoomAvailable(room) || !isExistingConnection(socketInfo.connectionId)) {
    addNewUser(socketInfo.connectionId, {
      room,
      trainerToken,
      isTrainer: !!trainerToken,
    });
    socketInfo.socket.join(room);
  }
  return [{ type: OutputMessageTypes.CONNECTION_ESTABLISHED_TRAINER }];
};
