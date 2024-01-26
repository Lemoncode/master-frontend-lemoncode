<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    <hr />
    <input type="text" v-model="textFilter" />
    <hr />

    <ul class="product-list">
      <li v-for="product in filteredList" :key="product.id">
        <NuxtLink :to="`/product/${product.id}`">
          <ProductListItem :product="product" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
// Service API
const { list } = await useProductsApi()

// Filtering
// const { totalProducts, filteredList } = useFilteredList({ list, textFilter })
const filteredListStore = useFilteredListStore()

filteredListStore.setList(list)

const { filteredList, textFilter } = storeToRefs(filteredListStore)
const totalProducts = computed(() => filteredList.value.length)
</script>

<style lang="scss" scoped>
.product-list {
  padding: 0;
  li {
    margin-bottom: 2em;
  }
}
</style>
