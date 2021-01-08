import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books: Product[] = await fetch('./books.mock.json').then(response =>
      response.json()
    )
    return books
  },
}
