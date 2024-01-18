<template>
  <main class="flex-grow flex flex-col p-2">
    <h1>Welcome!</h1>

    <form class="mt-4" @submit.prevent="onSubmit">
      <!-- Title -->
      <input
        type="text"
        v-model="title"
        class="block mb-2 w-full border-2 border-gray-300 rounded-md p-2 text-black"
        placeholder="Nombre GPT"
      />
      <!-- Goal -->
      <input
        type="text"
        v-model="systemGoal"
        class="block mb-2 w-full border-2 border-gray-300 rounded-md p-2 text-black"
        placeholder="Eres {alguien...}, quiero {objetivo...}..."
      />
      <button class="bg-teal-500 p-2 rounded-md">Create Chat</button>
    </form>
  </main>
</template>

<script setup lang="ts">
const router = useRouter()

const chatHistory = useChatHistory()

const title = ref('')
const systemGoal = ref('')

const onSubmit = () => {
  if (!systemGoal.value || !title.value) return

  const { chatId } = chatHistory.registerChat(title.value, systemGoal.value)

  router.push(`/c/${chatId}`)
}
</script>
