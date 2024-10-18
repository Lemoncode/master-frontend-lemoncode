<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: {
    type: String,
  },
  class: {
    type: String,
  },
})
const style = computed(() => ({
  backgroundImage: `url(${props.image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))
</script>

<template>
  <div class="grid grid-cols-2 w-full h-full">
    <div class="slidev-layout default image-right" :class="props.class">
      <slot />
    </div>
    <div class="grid items-center justify-center h-full">
      <div class="w-46 h-46 rounded-full" :style="style" />
    </div>
  </div>
</template>
