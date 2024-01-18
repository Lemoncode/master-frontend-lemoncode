<template>
  <output
    ref="output"
    class="border rounded-md p-3 max-h-[450px] overflow-scroll"
  >
    <ChatMessage
      v-for="message in filteredConversation"
      :key="message.timestamp"
      :record="message"
      class="mb-3"
    />
  </output>
</template>

<script setup lang="ts">
import type { ChatRecord } from '~/types'

const props = defineProps<{
  conversation: ChatRecord[]
}>()

// Filter system messages
const filteredConversation = computed(() =>
  props.conversation.filter((record) => record.sender !== 'system')
)

// Scroll
const output = ref<HTMLOutputElement | null>(null)

onUpdated(() => {
  if (!output.value) return

  output.value.scrollTop = output.value.scrollHeight
})
</script>
