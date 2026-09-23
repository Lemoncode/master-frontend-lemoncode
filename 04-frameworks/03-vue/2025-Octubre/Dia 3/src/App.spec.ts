import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { mount } from '@vue/test-utils'
import App from './App.vue'
import router from './router'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts App properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()

    expect(wrapper.text()).toContain('My Tasks Keeper')
  })
})
