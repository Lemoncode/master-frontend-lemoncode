<template>
  <div class="h-full flex-1 grid grid-rows-[3fr,1fr]">
    <ChatTheOutput :conversation="conversation" />
    <form @submit.prevent="onSubmit" class="flex mt-2">
      <textarea
        v-model="message"
        row="10"
        class="w-full border-2 border-gray-300 bg-transparent rounded-md"
      ></textarea>
      <button type="submit" class="rounded-sm bg-teal-500">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  chatId: string;
}>();

defineOptions({
  name: 'Chat',
});

// message
const message = ref('');

// chat history
const chatHistory = useChatHistory();
const conversation = computed(
  () => chatHistory.getConversation(props.chatId) || []
);
// AI
const ai = useAI();

// onSubmit
const onSubmit = () => {
  // send message to OpenAI
  ai.getCompletion(message.value).then(({ response, error }) => {
    if (error) {
      console.error(error);
      return;
    }

    if (!response) {
      console.error('No response');
      return;
    }

    chatHistory.addMessage(
      {
        message: response,
        timestamp: new Date().getTime(),
        sender: 'ai',
      },
      props.chatId
    );
  });

  // add message to conversation
  chatHistory.addMessage(
    {
      message: message.value,
      timestamp: new Date().getTime(),
      sender: 'user',
    },
    props.chatId
  );

  // clear message
  message.value = '';
};
</script>
