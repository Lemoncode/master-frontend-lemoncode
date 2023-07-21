import { ProductResponse } from '@/types'

export const productService = {
  async get() {
    const products = await $fetch<ProductResponse>(
      'https://dummyjson.com/products'
    )
    return products
  },
}
