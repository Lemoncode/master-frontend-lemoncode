<template>
  <div class="h-full flex-1 grid grid-rows-[3fr,1fr]">
    <output class="bg-gray-300 whitespace-pre-wrap">
      {{ output }}
    </output>
    <form @submit.prevent="onSubmit" class="flex">
      <textarea
        v-model="message"
        row="10"
        class="w-full border-2 border-gray-300 rounded-sm"
      ></textarea>
      <button type="submit" class="rounded-sm bg-teal-500">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{}>();

defineOptions({
  name: 'Chat',
});

// onSubmit
const onSubmit = () => {
  // send message

  // add message to output
  output.value += `${message.value}\n`;
  message.value = '';
  // clear message
  console.log({ message });
};

// message
const message = ref('');

// output
const output = ref('');
</script>
