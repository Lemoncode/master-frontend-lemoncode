<template>
  <ChatTheChat :chatId="chatId" />
</template>

<script setup lang="ts">
const route = useRoute();

const chatId = computed(() => route.params.chatId as string);
</script>
