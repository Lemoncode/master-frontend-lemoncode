<template>
  <div class="">
    <ChatOpenAiIcon
      class="size-10 p-2 rounded-full bg-green-400"
      v-if="sender === 'ai'"
    />
    <ChatUserIcon
      class="size-10 p-2 rounded-full bg-gray-400"
      v-if="sender === 'user'"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChatRecord } from '~/types';

defineProps<{
  sender: ChatRecord['sender'];
}>();
</script>
