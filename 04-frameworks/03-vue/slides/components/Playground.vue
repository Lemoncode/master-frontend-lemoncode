<script setup lang="ts">
defineProps<{
  url: string
  label?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="playground-viewport">
      <iframe
        :src="url"
        :title="label ?? 'Vue SFC Playground'"
        class="playground-frame"
        loading="lazy"
        allow="fullscreen"
      />
    </div>
    <a :href="url" target="_blank" rel="noreferrer" class="text-xs opacity-70">
      Abrir en play.vuejs.org ↗
    </a>
  </div>
</template>

<style scoped>
.playground-viewport {
  height: 42vh;
  overflow: hidden;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.5rem;
  background: white;
}

.playground-frame {
  width: 142.87%;
  height: 142.87%;
  border: 0;
  transform: scale(0.7);
  transform-origin: top left;
}
</style>
