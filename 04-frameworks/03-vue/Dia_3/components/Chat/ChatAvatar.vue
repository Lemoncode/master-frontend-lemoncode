<template>
  <div>
    <ChatOllamaIcon aria-label="Ollama logo" class="size-16 p-2 flex-shrink-0  rounded-full bg-green-400"
      v-if="sender === 'ai'" />
    <ChatUserIcon aria-label="User icon" class="size-16 p-2  flex-shrink-0 rounded-full bg-gray-400"
      v-if="sender === 'user'" />
  </div>
</template>

<script setup lang="ts">
import type { ChatRecord } from '~/types';

defineProps<{
  sender: ChatRecord['sender'];
}>();
</script>
