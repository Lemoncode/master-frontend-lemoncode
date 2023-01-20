import { productService } from '@/services/products'

export default async function useProductsApi() {
  const list = await productService.get()

  const totalProducts = computed(() => list.length)

  return { list, totalProducts }
}
