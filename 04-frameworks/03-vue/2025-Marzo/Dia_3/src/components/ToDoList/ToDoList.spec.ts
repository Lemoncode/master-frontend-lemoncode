import { beforeEach, describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'

import ToDoList from './ToDoList.vue'
import { createPinia, setActivePinia } from 'pinia'
import type { ToDo } from '@/types'
import { nextTick } from 'vue'

describe('ToDoList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render', () => {
    const wrapper = mount(ToDoList)

    const label = wrapper.find('label')

    expect(label.text()).toMatchInlineSnapshot(`"Show only pending"`)
  })
})

describe('ToDoList (with localStorage)', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
  })

  beforeEach(() => {
    localStorage.setItem(
      'todos',
      JSON.stringify(<ToDo[]>[
        { timestamp: 1, text: 'First todo', completed: false },
        { timestamp: 2, text: 'Second todo', completed: true },
      ]),
    )
  })

  it('should render a list with the expected number of items', async () => {
    const wrapper = mount(ToDoList)
    // Wait for the next tick to allow the component to update
    // after the localStorage data is loaded inside the `onMounted` hook
    await nextTick()

    const list = wrapper.find('ul')
    const listItems = list.findAll('li')

    expect(listItems).toHaveLength(2)
  })

  it('should render a list and some items should be checked', async () => {
    const wrapper = mount(ToDoList)
    // Wait for the next tick to allow the component to update
    // after the localStorage data is loaded inside the `onMounted` hook
    await nextTick()

    const list = wrapper.find('ul')
    const listItems = list.findAll('li')

    const checkedItems = listItems.filter((item) => item.find('input').element.checked)

    expect(checkedItems).toHaveLength(1)
  })

  it('should render a list and the items can be checked', async () => {
    const wrapper = mount(ToDoList)
    // Wait for the next tick to allow the component to update
    // after the localStorage data is loaded inside the `onMounted` hook
    await nextTick()

    const list = wrapper.find('ul')
    const listItems = list.findAll('li')

    const unCheckedItems = listItems.filter((item) => !item.find('input').element.checked)

    expect(unCheckedItems).toHaveLength(1)

    await unCheckedItems[0].find('input').trigger('click')

    const checkedItems = listItems.filter((item) => item.find('input').element.checked)

    expect(checkedItems).toHaveLength(2)
  })
})
