import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books = await fetch('/books.mock.json', {
      headers: {
        Accept: 'application/json',
      },
    }).then(m => m.json())
    return books
  },
  async getProduct(id: Product['id']): Promise<Product | undefined> {
    if (!id) throw new Error('id is required')
    return this.get().then(list => {
      return list.find((item: Product) => String(item.id) === String(id))
    })
  },
}
