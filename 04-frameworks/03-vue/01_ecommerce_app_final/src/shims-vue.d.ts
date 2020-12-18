import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Router, createRouter } from 'vue-router'

import { CartState } from './store/Cart'
import './types'


declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
declare module '@vue/runtime-core' {
  // declare your own store states
  interface ICartState extends CartState {}

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<ICartState>
    $router: Router
  }
}