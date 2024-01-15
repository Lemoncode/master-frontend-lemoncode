import { defineStore } from 'pinia';
import type { ChatRecord } from '@/types';

// const conversation = {
//   [chatId]: []
// };

type ChatId = string;

export const useChatHistory = defineStore(
  'chatHistory',
  () => {
    // list of conversations
    const conversations = ref<Record<ChatId, ChatRecord[]>>({});

    // get conversation
    const getConversation = (chatId: ChatId) => {
      return conversations.value[chatId];
    };

    // add message
    const addMessage = (message: ChatRecord, chatId: ChatId) => {
      conversations.value[chatId] = conversations.value[chatId] || [];

      conversations.value[chatId].push(message);
    };

    const getChatIds = () => {
      return Object.keys(conversations.value);
    };

    return {
      conversations,
      addMessage,
      getConversation,
      getChatIds,
    };
  },
  {
    persist: true,
  }
);
