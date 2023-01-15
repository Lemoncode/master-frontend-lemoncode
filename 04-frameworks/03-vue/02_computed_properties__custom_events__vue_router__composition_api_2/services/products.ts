import { Product } from '~~/types'

export const productService = {
  async get() {
    const { products } = await fetch('https://dummyjson.com/products').then(
      (r) => r.json()
    )
    return products as Product[]
  },
}
