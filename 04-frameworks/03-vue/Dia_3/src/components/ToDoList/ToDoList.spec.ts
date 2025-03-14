import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ToDoList from './ToDoList.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('ToDoList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render', () => {
    const wrapper = mount(ToDoList)

    const label = wrapper.find('label')

    console.log(label)

    expect(label.text()).toMatchInlineSnapshot(`"Show only pending"`)
  })
})
