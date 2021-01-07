<template>
  <ul>
    <li v-for="product in list" :key="product.id">
      {{ product.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { productService } from '@/services/products'
import { defineComponent } from 'vue'
import { Product } from '@/types'

export default defineComponent({
  data() {
    return {
      list: [] as Product[],
    }
  },
  async created() {
    this.list = await productService.get()
  },
})
</script>

<style></style>
