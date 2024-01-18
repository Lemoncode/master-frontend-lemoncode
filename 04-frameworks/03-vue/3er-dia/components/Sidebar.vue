<template>
  <div class="p-2 h-full flex flex-col justify-between">
    <ul>
      <li v-for="chat in chats" class="mb-2">
        <NuxtLink :to="`/c/${chat.chatId}`">{{
          chat.title || chat.chatId
        }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const chatHistory = useChatHistory()
const chats = computed(() => chatHistory.getChatIds())
</script>
