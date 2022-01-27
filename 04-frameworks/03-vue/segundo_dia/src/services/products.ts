import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books = await fetch('/books.mock.json', {
      headers: {
        Accept: 'application/json',
      },
    }).then((res) => res.json())

    return books
  },
  async getProduct(id: string): Promise<Product | undefined> {
    if (!id) {
      throw new Error('id is required')
    }
    return this.get().then((products) =>
      products.find((product) => product.id === id)
    )
  },
}
