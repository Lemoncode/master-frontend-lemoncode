<template>
  <ProductList :products="products" />
</template>

<script setup lang="ts">
import { productService } from '@/services/products'
import { ProductResponse } from '@/types'

const route = useRoute()
const category = route.params.category as string

const { data: response } = useAsyncData<ProductResponse>(() =>
  productService.getProductsByCategory(category)
)

const products = computed(() => response.value?.products ?? [])
</script>
