import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MyHeader from './MyHeader.vue'
import router from '@/router'
import { useListStore } from '@/stores/lists'

describe('MyHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the title', async () => {
    const wrapper = mount(MyHeader, {
      global: {
        plugins: [router],
      },
    })

    await router.isReady()

    expect(wrapper.text()).toContain('My Tasks Keeper')
  })

  it('creates a new list when the New List button is clicked', async () => {
    const listStore = useListStore()

    const createListSpy = vi.spyOn(listStore, 'createList').mockResolvedValue({
      id: 'newListId',
      createdAt: Date.now(),
      title: '',
      position: 0,
    })
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(MyHeader, {
      global: {
        plugins: [router],
      },
    })

    await router.isReady()

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(createListSpy).toHaveBeenCalled()
    await flushPromises()
    expect(pushSpy).toHaveBeenCalled()
  })
})
