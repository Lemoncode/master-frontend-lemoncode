<template>
  <ul class="py-3">
    <li v-for="chat in chats" class="pl-2 mb-3">
      <nuxt-link active-class="text-green-500" :to="`/chat/${chat}`">
        {{ chat }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
const chatHistory = useChatHistory();

const chats = computed(() => chatHistory.getChatsList());
</script>