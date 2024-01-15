<template>
  <div class="slidev-layout cover grid-rows-[2fr_1fr] gap-4">
    <img v-if="image" :src="image" class="block m-auto max-h-xs" alt="" />

    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default: '',
  },
});
</script>
