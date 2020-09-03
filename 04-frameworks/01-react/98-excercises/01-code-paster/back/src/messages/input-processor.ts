import { InputMessageTypes, OutputMessageTypes } from './consts';
import {
  Action,
  InputEstablishConnectionMaster,
  InputEstablishConnectionPlayer,
  OutputConnectionEstablishedMaster,
  OutputConnectionEstablishedPlayer,
  SocketInfo,
} from './model';
import {
  isTrainerUser,
  getRoomFromConnectionId,
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
      const payloadECM: InputEstablishConnectionMaster = action.payload;
      outputActionCollection = handleEstablishConnectionTrainer(
        socketInfo,
        payloadECM.room,
        payloadECM.trainertoken
      );
      break;
  }

  return outputActionCollection;
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

  if (isRoomAvailable(room)) {
    addNewUser(socketInfo.connectionId, {
      room,
      trainerToken,
      isTrainer: !!trainerToken,
    });
    socketInfo.socket.join(room);

    return [{ type: OutputMessageTypes.CONNECTION_ESTABLISHED_TRAINER }];
  } else {
    // Multiple trainers in one session (later on ADD)
    // TODO Enque Error master
    return [
      { type: OutputMessageTypes.ERROR_MULTI_TRAINER_NOT_IMPLEMENTED_YET },
    ];
  }
};
