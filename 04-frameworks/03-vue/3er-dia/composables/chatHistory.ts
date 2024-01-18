import { defineStore } from 'pinia'
import type { ChatRecord } from '@/types'

// const conversation = {
//   [chatId]: {title: string, messages: ChatRecord[]}
// };

type ChatId = string

type Conversation = {
  [chatId: string]: { title: string; messages: ChatRecord[] }
}

const generateId = () => {
  const id = Math.random().toString(36).substring(2, 15)
  return id
}

export const useChatHistory = defineStore(
  'chatHistory',
  () => {
    // list of conversations
    const conversations = ref<Conversation>({})

    // get conversation
    const getConversation = (chatId: ChatId) => {
      return conversations.value[chatId].messages
    }

    // add message
    const addMessage = (message: ChatRecord, chatId: ChatId) => {
      conversations.value[chatId].messages.push(message)
    }

    const getChatIds = () => {
      return Object.keys(conversations.value).map((chatId) => {
        return { chatId, title: conversations.value[chatId].title }
      })
    }

    const registerChat = (title: string, systemGoal: string) => {
      const chatId = generateId()

      conversations.value[chatId] = {
        title,
        messages: [
          {
            sender: 'system',
            message: systemGoal,
          },
        ],
      }

      return { chatId }
    }

    return {
      conversations,
      addMessage,
      getConversation,
      getChatIds,
      registerChat,
    }
  },
  {
    persist: true,
  }
)
