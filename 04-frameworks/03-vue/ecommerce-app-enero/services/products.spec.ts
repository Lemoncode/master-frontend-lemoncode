import { productService } from './products'

describe('Product Service', () => {
  it('should get a list of products', async () => {
    global.$fetch = vitest.fn().mockResolvedValue(() => ({ products: [] }))

    const products = await productService.get()
    expect(global.$fetch).toHaveBeenCalledWith('https://dummyjson.com/products')
  })

  it('should get a single product', async () => {
    global.$fetch = vitest.fn().mockResolvedValue(() => ({ id: '' }))

    const id = 3
    const products = await productService.getProductById(id)

    expect(global.$fetch).toHaveBeenCalledWith(
      `https://dummyjson.com/products/${id}`
    )
  })
})
