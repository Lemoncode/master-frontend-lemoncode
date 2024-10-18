import ollama from 'ollama';

export default function useAI() {
  const getCompletion = async (prompt: string) => {
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.message.content;
  };

  return { getCompletion };
}
