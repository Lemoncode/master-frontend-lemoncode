import OpenAI from 'openai';

export const useAI = () => {
  const config = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: config.public.openAiApiKey,
    dangerouslyAllowBrowser: true,
  });

  const getCompletion = async (prompt: string) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.5,
      });

      return { response: response.choices[0].message?.content };
    } catch (error) {
      console.error(error, { reason: (error as any)?.response?.data });

      return { error };
    }
  };

  return { getCompletion };
};
