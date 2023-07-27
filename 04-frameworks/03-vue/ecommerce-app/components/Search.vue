<template>
  <div class="relative">
    <form @submit="onSubmit">
      <label for="searchText">Búsqueda</label>
      <input
        v-model="searchText"
        type="search"
        name="searchText"
        id="searchText"
      />

      <button type="submit">Buscar</button>
    </form>

    <div v-if="suggestions.length" class="card">
      <ul>
        <li v-for="product of suggestions">
          <NuxtLink :to="`/product/${product.id}`" @click="removeSuggestions">
            {{ product.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productService } from '@/services/products'
import { Product } from 'types'

import { watchDebounced } from '@vueuse/core'

const suggestions = ref<Product[]>([])

const searchText = ref('')

const onSubmit = async (event: Event) => {
  event.preventDefault()

  performSearch(searchText.value)
}

const performSearch = async (searchText: string) => {
  if (searchText.length) {
    const response = await productService.searchProducts(searchText)

    suggestions.value = response.products
  }
}

const removeSuggestions = () => {
  suggestions.value = []
}

watchDebounced(
  searchText,
  (value: string) => {
    if (value.length === 0) {
      suggestions.value = []

      return
    }

    performSearch(value)
  },
  {
    debounce: 500,
  }
)
</script>

<style scoped>
.card {
  position: absolute;
  top: 100%;
  background-color: white;
  left: 0;
  right: 0;
}
</style>
