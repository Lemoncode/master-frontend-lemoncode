import { defineStore } from 'pinia';
import type { ChatRecord, ChatUsers } from '~/types';

const messageFactory = (
  message: string,
  sender: 'user' | 'ai'
): ChatRecord => ({
  message,
  timestamp: Date.now(),
  sender,
});

export const useChatHistory = defineStore(
  'chatHistory',
  () => {
    const conversations = ref<Record<string, ChatRecord[]>>({});

    const addMessage = (message: string, sender: ChatUsers, chatId: string) => {
      const chatRecord = messageFactory(message, sender);
      conversations.value[chatId].push(chatRecord);
    };

    const generateChatId = () => {
      return Math.random().toString(36).substring(2, 15);
    };

    const registerNewChat = (chatId: string) => {
      conversations.value[chatId] = [];
    };

    return {
      generateChatId,
      addMessage,
      getConversation: (chatId: string) => conversations.value[chatId],
      registerNewChat,
    };
  },
  {
    persist: true,
  }
);
