// TODO: Add env variables
export const baseSocketUrl = 'http://localhost:3001';

export const SocketOuputMessageLiteral = {
  MESSAGE: 'message',
};

export const SocketEmitMessageTypes = {
  TRAINER_APPEND_TEXT: 'TRAINER_APPEND_TEXT', // Master creates a user story
};

export const SocketReceiveMessageTypes = {
  CONNECTION_ACK: 'CONNECTION_ACK',
  APPEND_TEXT: 'APPEND_TEXT',
  REPLACE_FULL_TEXT: 'REPLACE_FULL_TEXT',
};
