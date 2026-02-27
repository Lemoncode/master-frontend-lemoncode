import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('should render', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Hello World',
      },
    })

    expect(wrapper.html()).toContain('<h1>Hello World</h1>')
  })

  it('emits the salute event', () => {
    const wrapper = mount(HelloWorld, {
      props: {
        msg: 'Hello World',
      },
    })

    const button = wrapper.find('button')
    button.trigger('click')

    const emittedEvents = wrapper.emitted()

    expect(emittedEvents.salute[0]).toEqual(['hiiiiii'])
  })
})
