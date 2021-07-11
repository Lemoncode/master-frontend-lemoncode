<template>
  <div class="grid">
    <div>
      <img :src="`https://picsum.photos/id/${id}/600`" alt="" />
    </div>
    <div v-if="product">
      <h1>{{ product.title }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocation } from 'vue-router'
import { Product } from '@/types'
import { productService } from '@/services/productService'

export default defineComponent({
  data: () => ({
    product: {} as Product,
  }),
  computed: {
    id(): string {
      return String((this.$route as RouteLocation).params.id)
    },
  },
  created() {
    productService.getProduct(this.id).then((product: Product | undefined) => {
      if (product) {
        this.product = product
      }
    })
  },
})
</script>

<style></style>
