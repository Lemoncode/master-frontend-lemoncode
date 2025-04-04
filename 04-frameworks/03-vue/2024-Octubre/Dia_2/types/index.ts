export type ChatUsers = 'user' | 'ai';

export type ChatRecord = {
  message: string;
  timestamp: number;
  sender: ChatUsers;
};
