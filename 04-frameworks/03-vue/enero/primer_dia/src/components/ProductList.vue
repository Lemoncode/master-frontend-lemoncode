<template>
  <ul>
    <li v-for="product in list" :key="product.id">
      <h2>
        {{ product.title }}
      </h2>
      <p>
        <span class="grey-text">Author: </span>
        <strong>{{ product.author }}</strong>
      </p>
      <p>
        <span class="grey-text">Publisher: </span>
        {{ product.publisher }}
      </p>
      <p><span class="grey-text">Year: </span>{{ product.published }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { productService } from '@/services/products.ts'

import { Product } from '@/types'

export default defineComponent({
  data() {
    return {
      list: [] as Product[],
    }
  },
  async created() {
    this.list = await productService.get()
    console.log(this.list)
  },
})
</script>

<style></style>
