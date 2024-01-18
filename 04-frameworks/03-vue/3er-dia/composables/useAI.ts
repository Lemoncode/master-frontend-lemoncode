import OpenAI from 'openai'
import type { ChatCompletion, ChatCompletionMessage } from 'openai/resources'
import type { ChatRecord } from '~/types'

export const useAI = () => {
  const config = useRuntimeConfig()

  const openai = new OpenAI({
    apiKey: config.public.openAiApiKey,
    dangerouslyAllowBrowser: true,
  })

  const getCompletion = async (prompt: string, conversation: ChatRecord[]) => {
    const previousMessages = conversation.map((message) => ({
      role:
        message.sender === 'user'
          ? 'user'
          : message.sender === 'ai'
          ? 'assistant'
          : 'system',
      content: message.message,
    }))

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          ...(previousMessages as ChatCompletionMessage[]),
          { role: 'user', content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.5,
      })

      return { response: response.choices[0].message?.content }
    } catch (error) {
      console.error(error, { reason: (error as any)?.response?.data })

      return { error }
    }
  }

  return { getCompletion }
}
