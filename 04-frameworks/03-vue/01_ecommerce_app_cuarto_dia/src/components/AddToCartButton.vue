<template>
  <button class="button" type="button" @click.stop.prevent="addItem(product)">
    Add to cart
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@/types'
import { mapActions } from 'vuex'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  methods: {
    ...mapActions('CartModule', ['addItemToCart']),
    addItem(product: Product): void {
      this.addItemToCart(product)
    },
  },
})
</script>
