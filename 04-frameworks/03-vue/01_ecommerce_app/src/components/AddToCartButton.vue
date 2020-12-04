<template>
  <button class="button" type="button" @click="addItem(product)">
    Add to Cart
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    addItem(product: Product) {
      console.log({ product })
    },
  },
})
</script>
