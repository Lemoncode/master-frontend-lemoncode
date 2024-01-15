import { defineStore } from 'pinia';

export const useChatHistory = defineStore('chatHistory', () => {
  // list of messages
  const messages = ref([]);

  // add message
  const addMessage = (message) => {
    messages.value.push(message);
  };

  return {};
});
