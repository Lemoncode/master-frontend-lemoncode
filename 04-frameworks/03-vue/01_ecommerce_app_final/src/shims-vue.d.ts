import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Router, createRouter } from 'vue-router'

import './types'


declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// https://next.vuex.vuejs.org/guide/typescript-support.html#typing-store-property-in-vue-component
declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<ICartState>
    $router: Router
  }
}