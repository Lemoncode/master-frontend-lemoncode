import { mount } from '@vue/test-utils'

import Header from '../Header.vue'

describe('Header', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Header)
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
