<template>
  <output class="border rounded-md p-3">
    <ChatMessage
      v-for="message in conversation"
      :key="message.timestamp"
      :record="message"
      class="mb-3"
    />
  </output>
</template>

<script setup lang="ts">
import type { ChatRecord } from '~/types';

defineProps<{
  conversation: ChatRecord[];
}>();
</script>
