<script setup lang="ts">
const title = defineModel<string>({ required: true })
</script>

<template>
  <input
    v-model="title"
    type="text"
    aria-label="Título de la lista"
    class="w-full border-b border-transparent bg-transparent pb-1 font-serif text-2xl font-semibold text-ink outline-none transition focus:border-accent"
  />
</template>
