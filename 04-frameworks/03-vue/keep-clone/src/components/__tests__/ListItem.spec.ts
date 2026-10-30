import { describe, expect, it } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ListItem from '../ListItem.vue'

function makeItem(content = '') {
  return {
    id: 'item-1',
    listId: 'list-1',
    content,
    isChecked: false,
    position: 0,
    createdAt: 0,
  }
}

describe('ListItem', () => {
  it('starts editing a new empty item and focuses the input', async () => {
    const wrapper = mount(ListItem, {
      props: { item: makeItem() },
      attachTo: document.body,
    })
    await nextTick()

    const input = wrapper.get('input')
    expect(document.activeElement).toBe(input.element)

    wrapper.unmount()
  })

  it('saves and creates another item on Enter when there is content', async () => {
    const wrapper = mount(ListItem, {
      props: { item: makeItem('Leche') },
      attachTo: document.body,
    })

    await wrapper.get('button.text-left').trigger('click')
    const input = wrapper.get('input')
    await input.setValue('Leche entera')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update')?.[0]).toEqual([{ content: 'Leche entera' }])
    expect(wrapper.emitted('create')).toHaveLength(1)

    wrapper.unmount()
  })

  it('does not create another item on Enter when empty', async () => {
    const wrapper = mount(ListItem, {
      props: { item: makeItem() },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.get('input').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('create')).toBeUndefined()

    wrapper.unmount()
  })
})
