import ollama from 'ollama';
import type { ChatRecord } from '~/types';

export default function useAI() {
  const getCompletion = async (conversation: ChatRecord[]) => {
    // Map ChatRecord to Message
    const messages = conversation.map((record) => {
      return {
        role: record.sender === 'user' ? 'user' : 'assistant',
        content: record.message,
      };
    });

    const response = await ollama.chat({
      model: 'lemoncode3.1',
      messages,
    });

    return response.message.content;
  };

  return { getCompletion };
}
