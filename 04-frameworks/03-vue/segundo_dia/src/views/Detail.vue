<template>
  <div class="grid">
    <div>
      <img :src="`https://picsum.photos/id/${id}/600`" alt="" />
    </div>
    <div v-if="product">
      <h1>{{ product.title }}</h1>
      <p class="flex">Price:&nbsp;<StaticPrice :quantity="product.price" /></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocation } from 'vue-router'

import { Product } from '@/types'
import { productService } from '@/services/products'

import StaticPrice from '@/components/StaticPrice.vue'

export default defineComponent({
  components: {
    StaticPrice,
  },
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
