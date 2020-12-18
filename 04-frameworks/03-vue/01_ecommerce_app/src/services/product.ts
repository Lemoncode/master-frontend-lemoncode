import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books = await import(
      /* webpackChunkName: "books" */ './books.mock.json'
    ).then(m => m.default)
    return books
  },
}
