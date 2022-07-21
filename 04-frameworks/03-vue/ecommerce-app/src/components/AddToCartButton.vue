<template>
  <button @click.prevent="addItem">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    addItem() {
      this.$emit('add-item')
    },
  },
})
</script>
