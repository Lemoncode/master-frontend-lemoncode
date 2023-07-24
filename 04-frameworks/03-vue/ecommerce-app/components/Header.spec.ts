import { render, screen } from '@testing-library/vue'

import { setActivePinia, createPinia } from 'pinia'

import Header from './Header.vue'
import { Product } from 'types'

describe('Header', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the header', () => {
    render(Header)

    screen.getByText('Cart 0')
  })

  it('should reflect correctly the cart count', async () => {
    const cart = useCartStore()

    render(Header)

    const fakeProduct: Product = {
      id: 1,
      title: 'fake product',
      price: 10,
      discountPercentage: 0,
      thumbnail: 'fake-image.jpg',
      images: [],
      description: 'fake description',
      brand: 'fake brand',
      category: 'fake category',
      rating: 5,
      stock: 10,
    }

    await cart.addToCart(fakeProduct)

    screen.getByText('Cart 1')
  })
})
