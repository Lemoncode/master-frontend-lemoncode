<template>
  <div class="h-full flex flex-col justify-between">
    <ul>
      <li v-for="chat in chats">
        <NuxtLink :to="`c/${chat}`">{{ chat }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const chatHistory = useChatHistory();
const chats = computed(() => chatHistory.getChatIds());
</script>
