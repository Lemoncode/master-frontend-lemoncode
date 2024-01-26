import { render, screen } from '@testing-library/vue'
import StaticPrice from './StaticPrice.vue'

describe('StaticPrice', () => {
  it('should render the price', () => {
    render(StaticPrice, {
      props: {
        quantity: 15.4,
      },
    })

    screen.getByText('15,40 €')
  })

  it('renders dollar sign when coin is USD', () => {
    render(StaticPrice, {
      props: {
        quantity: 15.4,
        coin: 'USD',
      },
    })

    screen.getByText('$15.40')
  })

  it('produces the expected output for euros', () => {
    const { container } = render(StaticPrice, {
      props: {
        quantity: 1_000_000,
      },
    })

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          1.000.000,00 €
        </div>
      </div>
    `)
  })
})
