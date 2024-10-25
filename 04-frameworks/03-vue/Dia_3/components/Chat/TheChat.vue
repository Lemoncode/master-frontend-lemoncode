<template>
  <section class="grid grid-rows-[1fr,200px] h-full px-3 pt-3 pb-5 gap-4 overflow-hidden">
    <ChatTheOutput :conversation="conversation" />

    <form @submit.prevent="onSubmit" class="flex justify-end gap-4">
      <textarea class="block w-full resize-none rounded-md p-2 bg-gray-700 border border-1 text-white"
        @keydown="onKeyDown" @keyup="onKeyUp" autofocus v-model="message"></textarea>

      <button type="button" v-if="hasAbort" class="rounded-md hover:bg-gray-700 hover:text-white p-3 self-end"
        @click="abort">Abort</button>

      <button class="rounded-md hover:bg-gray-700 hover:text-white p-3 self-end">
        Send
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const message = ref('');

const isShiftPressed = ref(false);

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Shift') {
    isShiftPressed.value = true;
  }
};

const onKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Shift') {
    isShiftPressed.value = false;
  }

  if (event.key === 'Enter' && !isShiftPressed.value) {
    onSubmit();

    return;
  }
};

const ai = useAI();

const route = useRoute();

const chatHistory = useChatHistory();
const chatId = computed(() => route.params.chatId as string)
const conversation = computed(() => chatHistory.getConversation(chatId.value));

let abort: () => void;
const hasAbort = ref(false);
const onSubmit = async () => {
  const chatRecord = chatHistory.messageFactory(message.value, 'user');
  chatHistory.addMessage(chatRecord, chatId.value);
  message.value = '';

  const response = await ai.getCompletion(conversation.value,);
  abort = response.abort
  hasAbort.value = true;

  await nextTick()

  const date = Date.now();

  for await (const part of response) {
    const chatRecord = chatHistory.messageFactory(part.message.content, 'ai', date);
    chatHistory.updateAssistantMessage(chatRecord, chatId.value);
  }
  abort = () => { };
  hasAbort.value = false;
};
</script>
