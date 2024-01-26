import { productService } from '@/services/products'

export default async function useProductsApi() {
  const [{ products }, categories] = await Promise.all([
    productService.get(),
    productService.getCategories(),
  ])

  const totalProducts = computed(() => products.length)

  return {
    list: products,
    categories,
    totalProducts,
  }
}
