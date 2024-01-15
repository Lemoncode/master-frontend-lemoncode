<template>
  <main class="flex-grow flex flex-col p-2">
    <h1>Welcome!</h1>

    <section class="mt-4">
      <button
        type="button"
        class="bg-teal-500 p-2 rounded-md"
        @click="createChat"
      >
        Create Chat
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
const router = useRouter();

const generateId = () => {
  const id = Math.random().toString(36).substring(2, 15);
  return id;
};

const createChat = () => {
  const chatId = generateId();
  router.push(`/c/${chatId}`);
};
</script>
