<template>
  <ChatTheChat />
</template>

<script setup lang="ts">
const chatHistory = useChatHistory();

const route = useRoute();

const chatId = computed(() => route.params.chatId as string);

if (!chatHistory.getConversation(chatId.value)) {
  chatHistory.registerNewChat(chatId.value);
}
</script>