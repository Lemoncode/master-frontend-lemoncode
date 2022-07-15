<template>
  <button @click.prevent="addItem">Add to cart</button>
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
