<template>
  <div>
    <h1>{{ msg }}</h1>
    <h2 v-if="subtitle">{{ subtitle }}</h2>
    <button @click="emit('salute', 'hiiiiii')">Click me</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
  subtitle?: string
}>()

const emit = defineEmits<{
  salute: [salutation: string]
}>()
</script>
