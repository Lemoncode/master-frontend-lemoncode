import { Product, ProductAPIResponse } from '~~/types'

export const productService = {
  async get() {
    const { products } = await $fetch<ProductAPIResponse>(
      'https://dummyjson.com/products'
    )
    return products
  },
  async getProductById(id: number) {
    const product = await $fetch<Product>(
      `https://dummyjson.com/products/${id}`
    )
    return product
  },
}
