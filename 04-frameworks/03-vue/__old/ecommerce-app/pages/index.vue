<template>
  <div class="flex">
    <aside>
      <ul>
        <li v-for="category in categories">
          <NuxtLink :to="`/category/${category}`">
            {{ category }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
    <ProductList :products="list" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default',
})

const cart = useCartStore()
const { totalItems } = storeToRefs(cart)

useSeoMeta({
  title: computed(() => `(${totalItems.value}) Home`),
})

const { list, categories } = await useProductsApi()
</script>

<style scoped>
aside {
  min-width: 20vw;
  max-width: 300px;
  padding: 1rem;
}
</style>
