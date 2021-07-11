import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books: Product[] = await import(
      /* webpackChunkName: "books" */ './books.mock.json'
    ).then(module => module.default)
    return books
  },
}
