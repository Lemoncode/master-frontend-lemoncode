import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default"
declare module "/Users/paul.melero/htdocs/mio/master-frontend-lemoncode/04-frameworks/03-vue/02_computed_properties__custom_events__vue_router__composition_api_2/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}