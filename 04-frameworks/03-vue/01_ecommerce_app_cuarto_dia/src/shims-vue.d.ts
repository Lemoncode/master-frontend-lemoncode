import { DefineComponent } from 'vue'
import VueRouter, { RouteLocation } from 'vue-router

declare module '*.vue' {
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: VueRouter
    $route: RouteLocation
  }
}
