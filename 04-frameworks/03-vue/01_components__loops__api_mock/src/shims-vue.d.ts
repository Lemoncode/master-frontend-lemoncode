import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

declare module '@vue/runtime-core' {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
