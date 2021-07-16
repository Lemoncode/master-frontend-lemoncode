import { Ref, ref, computed } from 'vue'

import { productService } from '@/services/products.ts'

import { Product } from '@/types'

export async function useProductApi() {
  const list: Ref<Product[]> = ref([])
  list.value = await productService.get()

  const totalProducts = computed<number>(() => list.value.length)

  return {
    list,
    totalProducts,
  }
}
