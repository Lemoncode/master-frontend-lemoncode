import type { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books = await fetch('/books.mock.json').then((response) =>
      response.json()
    )
    return books
  },
  async getProduct(id: Product['id']): Promise<Product | undefined> {
    return this.get().then((products) =>
      products.find((product) => product.id === id)
    )
  },
}
