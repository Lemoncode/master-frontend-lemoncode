import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import ProductList from './ProductList.vue'
import books from '../../public/books.mock.json'

vi.stubGlobal('fetch', () =>
  Promise.resolve({ json: () => Promise.resolve(books) })
)

describe('ProductList', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    // arrange
    wrapper = mount(
      {
        components: { ProductList },
        template: `
        <Suspense>
          <template #default>
            <ProductList />
          </template>
          <template #fallback>
            <div>Loading...</div>
          </template>
        </Suspense>
      `,
      },
      {
        global: {
          plugins: [createTestingPinia()],
        },
      }
    )

    await flushPromises()
  })

  it('renders a list of products', async () => {
    // assert
    expect(wrapper.findAll('li').length).toBe(100)
  })

  it('renders total products in the ui', async () => {
    // assert
    const selector = '.wrapper .flex:first-child'
    const element = wrapper.find(selector)
    const text = element.text()

    expect(text).toBe('Products total: 100')
  })
})
