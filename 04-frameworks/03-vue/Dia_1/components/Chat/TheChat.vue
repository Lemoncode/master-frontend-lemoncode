<template>
  <section
    class="grid grid-rows-[1fr,200px] h-full px-3 pt-3 pb-5 gap-4 overflow-hidden"
  >
    <output> </output>

    <form @submit.prevent="onSubmit" class="flex justify-end gap-4">
      <textarea
        class="block w-full resize-none rounded-md p-2 bg-gray-700 border border-1 text-white"
        @keydown="onKeyDown"
        @keyup="onKeyUp"
        autofocus
        v-model="message"
      ></textarea>
      <button
        class="rounded-md hover:bg-gray-700 hover:text-white p-3 self-end"
      >
        Send
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const message = ref('');

const isShiftPressed = ref(false);

const onKeyDown = (event: KeyBoardEvent) => {
  if (event.key === 'Shift') {
    isShiftPressed.value = true;
  }
};

const onKeyUp = (event: KeyBoardEvent) => {
  if (event.key === 'Shift') {
    isShiftPressed.value = false;
  }

  if (event.key === 'Enter' && !isShiftPressed.value) {
    onSubmit();

    return;
  }
};

const ai = useAI();

const onSubmit = async () => {
  console.log(message.value);
  // loading state
  // clear textarea
  message.value = '';

  const response = await ai.getCompletion(message.value);

  console.log({ response });
};
</script>
