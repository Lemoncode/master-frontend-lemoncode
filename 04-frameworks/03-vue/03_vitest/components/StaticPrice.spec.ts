import StaticPrice from './StaticPrice.vue'
import { render } from '@testing-library/vue'

describe('StaticPrice', () => {
  it('should render euros by default', () => {
    const { getByText } = render(StaticPrice, {
      props: {
        quantity: 15.4,
      },
    })

    getByText('15,40 €')
  })

  it('renders dollars if coin USD is passed', () => {
    const { getByText } = render(StaticPrice, {
      props: {
        quantity: 15.4,
        coin: 'USD',
      },
    })

    getByText('$15.40')
  })

  it('produces the expected snapshot for euros', () => {
    const { container } = render(StaticPrice, {
      props: {
        quantity: 1_000_000_000,
      },
    })

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          1.000.000.000,00 €
        </div>
      </div>
    `)
  })
})
