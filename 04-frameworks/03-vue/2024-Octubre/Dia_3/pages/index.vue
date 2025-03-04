<template>
  <form @submit.prevent="onSubmit">
    <button class="bg-teal-500 p-2 rounded-md">Create Chat</button>
  </form>
</template>

<script setup lang="ts">
const chatHistory = useChatHistory();

const router = useRouter();

const onSubmit = () => {
  const chatId = chatHistory.generateChatId();
  chatHistory.registerNewChat(chatId);

  // redirect to chat
  router.push(`/chat/${chatId}`);
};
</script>
