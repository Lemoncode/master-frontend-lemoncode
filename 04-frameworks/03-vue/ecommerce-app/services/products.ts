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

  async searchProducts(query: string) {
    const products = await $fetch<ProductResponse>(
      `https://dummyjson.com/products/search/?q=${query}&select=title`
    )

    return products
  },

  async getCategories() {
    const categories = await $fetch<string[]>(
      `https://dummyjson.com/products/categories`
    )

    return categories
  },

  async getProductsByCategory(category: string) {
    const products = await $fetch<ProductResponse>(
      `https://dummyjson.com/products/category/${category}`
    )

    return products
  },
}
