import { ref, Ref, computed, ComputedRef } from 'vue'
import { Product } from '@/types'
import { productService } from '@/services/products'

const useProductsApi = async (): Promise<{
  list: Ref<Product[]>
  totalProducts: ComputedRef<number>
}> => {
  const list: Ref<Product[]> = ref([])
  list.value = await productService.get()

  const totalProducts = computed(() => {
    return list.value.length
  })
  return { list, totalProducts }
}

export default useProductsApi
