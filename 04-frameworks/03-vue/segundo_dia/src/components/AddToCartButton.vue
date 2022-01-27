<template>
  <button class="button" type="button" @click.prevent="addItem()">
    Add to Cart
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@/types'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  methods: {
    addItem(): void {
      this.$emit('add-item', this.product)
    },
  },
})
</script>
