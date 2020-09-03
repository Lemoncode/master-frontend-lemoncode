import { Socket } from 'socket.io';

export type MessageType = 'message' | 'error';

export interface SocketInfo {
  socket: Socket;
  io: Socket;
  connectionId: string;
}

export interface Action {
  type: string;
  payload?: any;
  messageType?: MessageType;
}

export interface InputEstablishConnectionMaster {
  room: string;
  trainertoken: string;
}

export interface InputEstablishConnectionPlayer {
  nickname: string;
  room: string;
}

export interface InputCreateStoryPayload {
  content: string;
}

export interface OutputUserJoined {
  name: string;
}

export interface OutputConnectionEstablishedMaster {
  newUser: string;
}

export interface OutputConnectionEstablishedPlayer {
  newUser: string;
}

export interface OutputMasterUserVoted {
  vote: string;
}

interface UserVote {
  nickname: string;
  hasVoted: boolean;
  vote: string;
}

export interface OutputShowResults {
  userVoteCollection: UserVote[];
}

export interface OutputNewStory {
  content: string;
}
