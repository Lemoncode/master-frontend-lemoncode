import { productService } from '@/services/products'

export default async function useProductsApi() {
  const { products } = await productService.get()

  const totalProducts = computed(() => products.length)

  return {
    list: products,
    totalProducts,
  }
}
