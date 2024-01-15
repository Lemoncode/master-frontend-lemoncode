export type ChatRecord = {
  message: string;
  timestamp: number;
  sender: 'user' | 'ai';
};
