import { Ref, ref, computed } from 'vue'
import { productService } from '@/services/products'
import { Product } from '@/types'

export default async () => {
  const list: Ref<Product[]> = ref([])

  try {
    // only to avoid having to use Suspense:
    // if you do `async setup()`, you need to use Suspense.
    // because then setup wouldn't return an object, but a promise of an object!
    // so you could do:
    // ;(async () => (list.value = await productService.get()))()
    // and return an object with a ref!
    list.value = await productService.get()
  } catch (error) {
    console.log(error)
  }

  const totalProducts = computed<number>(() => list.value.length)

  return {
    list,
    totalProducts,
  }
}
