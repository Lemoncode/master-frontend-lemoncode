import { Product, ProductResponse } from '@/types'

export const productService = {
  async get() {
    const products = await $fetch<ProductResponse>(
      'https://dummyjson.com/products'
    )
    return products
  },

  async getProductById(id: string) {
    const product = await $fetch<Product>(
      `https://dummyjson.com/products/${id}`
    )

    return product
  },
}
