import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { productService } from '../services/products'
import type { Product } from '@/types'

export default async function useProductsApi() {
  const products: Ref<Product[]> = ref([])
  products.value = await productService.get()

  const totalProducts = computed(() => products.value.length)

  return { products, totalProducts }
}
