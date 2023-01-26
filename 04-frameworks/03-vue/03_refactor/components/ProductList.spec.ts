import { mountSuspended } from 'vitest-environment-nuxt/utils'

import { Product } from '~~/types'
import ProductList from './ProductList.vue'

const productFactory = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  description: `Description ${id}`,
  price: 100,
  images: [`https://picsum.photos/200/300?random=${id}`],
  brand: 'Brand',
  category: 'Category',
  rating: 4,
  discountPercentage: 0,
  stock: 10,
  thumbnail: `https://picsum.photos/200/300?random=${id}`,
})

describe('ProductList', () => {
  it('should render a list of products', async () => {
    vitest.mock('@/composables/useProductsApi', () => ({
      default: async () => ({
        list: [productFactory(1), productFactory(2)],
        totalProducts: 2,
      }),
    }))

    const vm = await mountSuspended(ProductList)

    expect(vm.findAll('.product-container')).toHaveLength(2)
  })
})
