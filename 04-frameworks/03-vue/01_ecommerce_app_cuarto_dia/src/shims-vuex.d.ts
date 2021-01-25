import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

import { CartState } from './store/Cart'

declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<CartState>
  }
}
