import { render } from '@testing-library/vue'
import Header from './Header.vue'

describe('Header', () => {
  it('renders the header', () => {
    const { getByText } = render(Header)

    getByText('Cart 0')
  })
  it('reflects correctly the number of products in the cart after the store has been updated', async () => {
    const cart = useCartStore()
    const { getByText } = render(Header)

    getByText('Cart 0')

    const fakeProduct = {
      id: 1,
      title: 'Product 1',
      price: 10,
      description: '',
      discountPercentage: 1,
      rating: 2,
      stock: 1,
      brand: '',
      category: '',
      thumbnail: '',
      images: [],
    }

    await cart.addItem(fakeProduct)

    getByText('Cart 1')
  })
})
