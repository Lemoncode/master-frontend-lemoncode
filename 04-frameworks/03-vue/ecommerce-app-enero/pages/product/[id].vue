<template>
  <div class="container">
    <NuxtLink to="/" class="back">⬅️ Go back</NuxtLink>
    <article>
      <div>
        <img :src="product?.images[0]" alt="" />
      </div>
      <div v-if="product">
        <h1>{{ product.title }}</h1>
        <p class="flex">
          Price:&nbsp;<StaticPrice :quantity="product.price" />
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { productService } from '~~/services/products'
import { Product } from '~~/types'

const route = useRoute()
const id = Number(route.params.id as string)

const { data: product } = useAsyncData<Product>(() =>
  productService.getProductById(id)
)
</script>

<style scoped>
.back {
  display: block;
  margin: 1rem 0;
}
</style>
