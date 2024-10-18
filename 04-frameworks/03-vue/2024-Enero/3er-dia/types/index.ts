export type ChatRecord = {
  message: string
  // not needed for system messages
  timestamp?: number
  sender: 'user' | 'ai' | 'system'
}
