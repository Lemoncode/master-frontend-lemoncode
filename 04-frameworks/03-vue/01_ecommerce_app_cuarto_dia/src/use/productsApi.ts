import { productService } from '@/services/products'
import { Product } from '@/types'
import { computed, ref, Ref } from 'vue'

export default async () => {
  const list: Ref<Product[]> = ref([])
  list.value = await productService.get()

  const totalProducts = computed<number>(() => list.value.length)

  return {
    list,
    totalProducts,
  }
}
