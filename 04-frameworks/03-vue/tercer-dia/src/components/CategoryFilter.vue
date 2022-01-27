<template>
  <button
    type="button"
    class="button"
    @click="$emit('selected-category', category)"
  >
    {{ category }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    category: {
      type: String,
      required: true,
    },
  },
})
</script>
