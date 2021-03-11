# ecommerce-app

Vamos a seguir con la aplicación donde la dejamos en la ayer. De momento,

- [x] hemos hecho el _bootstrapping_ de una app con Vue CLI
- [x] hemos borrado los archivos que venían por defecto ("assets", "components", "views"...)
- [x] hemos añadido un servicio "dummy" que nos devuelve una JSON
- [x] hemos añadido el primer componente que hace una llamada a esa lista y la pinta en la vista
- [x] hemos visto otras features de _Vue_ como "computed properties", "dynamic attributes binding", "custom events"
- [x] Y hemos ñadido una página nueva en _Vue Router_.

Hoy el objetivo es:

- [ ] Haremos un poquito de _refactor_ de nuestra app para usar la "Composition API"
- [ ] Añadiremos más funcionalidad con vuex: carrito

## Vue 3

Vamos a empezar por aplicar los cambios que vemos en los slides ayer para practicar la Composition API.

Nota, no es recomendable hacer un refactor de aplicaciones completas a la Composition API, ya que ambas no son excluyentes. Y la composition API no reemplaza a la Options API (basada en objetos).

Por ejemplo, un refactor del ProductList:

```vue
<script lang="ts">
import { defineComponent, computed, Ref, ref } from 'vue'
import { productService } from '@/services/products'
import { Product } from '@/types'

import AddToCartButton from '@/components/AddToCartButton.vue'
import StaticPrice from '@/components/StaticPrice.vue'

export default defineComponent({
  components: { AddToCartButton, StaticPrice },
  async setup() {
    const list: Ref<Product[]> = ref([])
    list.value = await productService.get()

    const totalProducts = computed<number>(() => list.value.length)

    const onAddItem = (product: Product) => {
      console.log(product.title)
    }

    return {
      list,
      totalProducts,
      onAddItem,
    }
  },
})
</script>
```

El único problema es que hemos dado con un caso particular. Cuando utilizamos `setup` con `async`, no devuelve un objeto, sino una promesa. Por lo tanto, necesitamos usar el componente `Suspense` que viene con Vue 3, alrededor de `ProductList`, para que funcione:

```diff
  <template>
    <div class="home">
-     <ProductList />
+     <div v-if="error">Error :(</div>
+     <Suspense>
+       <template #default>
+         <ProductList />
+       </template>
+       <template #fallback>loading...</template>
+     </Suspense>
    </div>
  </template>

  <script lang="ts">
- import { defineComponent } from 'vue'
+ import { defineComponent, onErrorCaptured, ref, Ref } from 'vue'
  import ProductList from '@/components/ProductList.vue'

  export default defineComponent({
    name: 'Home',
    components: {
      ProductList,
    },
+   setup() {
+     const error: Ref<unknown> = ref()
+     onErrorCaptured(errorCaptured => {
+       error.value = errorCaptured
+     })
+     return {
+       error,
+     }
+   },
  })
  </script>
```

De esta manera, tenemos una forma de controlar el estado de "cargando" y los errores que devolvería promesa.

Ahora, si queremos, podemos extraer de `ProductList` la lógica de la llamada a la API a su propio "módulo". Normalmente se estructuran estos archivos en una carpeta `src/use/` o en `src/composables/`. Pero la arquitectura está abierta a diferentes implementaciones. Por ejemplo, podemos optar a separar features por "dominios", siguiendo DDD.

El `script` de nuestro `ProductList` quedaría así:

```diff
  <script lang="ts">
-  import { defineComponent, computed, Ref, ref } from 'vue'
+  import { defineComponent } from 'vue'
  import { Product } from '@/types'

  import AddToCartButton from '@/components/AddToCartButton.vue'
  import StaticPrice from '@/components/StaticPrice.vue'
+ import useProductsApi from '@/use/productsApi'

  export default defineComponent({
    components: { AddToCartButton, StaticPrice },
    async setup() {
-     const list: Ref<Product[]> = ref([])
-     list.value = await productService.get()
-
-     const totalProducts = computed<number>(() => list.value.length)
+     const { list, totalProducts } = await useProductsApi()

      const onAddItem = (product: Product) => {
        console.log(product.title)
      }

      return {
        list,
        totalProducts,
        onAddItem,
      }
    },
  })
  </script>
```

De esta manera, el componente no tiene tanta responsabilidad como tenía antes. Lo que se llama _Dependency Inversion_, si no me equivoco. Ahora, hemos "abstraído" la responsabilidad de la llamada a la API y su implementación a otro módulo.

## Vuex

Vamos a empezar por añadir un "Store", como habréis visto en otros frameworks, vuex sirve para controlar la gestión de estado global de la aplicación.

Os lo enseño con un gráfico: https://miro.com/app/board/o9J_lZFBPQQ=/

Vuex "se sienta" horizontalmente en la app y desde cualquier componente (o página) podemos acceder a los datos que allí guardamos.

Los datos siempre deben fluir en el mismo sentido: `actions -> mutations -> state`. Os recordará a Redux, seguramente. Y es que Vuex y Redux están basados en la ["Flux Arquitecture"](https://facebook.github.io/flux/).

## Actions

Desde los componentes (o páginas) llamamos a "actions", para que se ejecute un cambio de estado. Las `actions` son asíncronas. Por lo tanto, es donde mucha gente coloca llamadas asíncronas. Pero mover toda la lógica de llamadas asíncronas a Vuex... está bien apra proyectos pequeños o medianos, en mi opinión. Personalmente, prefiero usar servicios como hemos hecho en nuestra app de ecommerce.

Las `actions` deberían describir acciones que se realizan en la interfaz, como "addToCart()".

## Mutations

Son las encargadas de editar el estado. Cada `mutation` tiene acceso al state y lo puede mutar. Ejemplo:

```ts
// se suelen definir en "cosntant case"
// https://vuex.vuejs.org/guide/mutations.html#using-constants-for-mutation-types
CHANGE_SOMETHING(state, newValue) {
  state.something = newValue // hacemos una mutación directamente!
}
```

Serían el equivalente a los "Reducers" de Redux. Pero la diferencia es que en Redux, los Reducers son funciones que devuelven una nueva copia del estado completo. En Vuex, cada `mutation`, muta una propiedad (o varias) del objeto `state`. Puede parecer más peligroso trabajar con un objeto mutable, pero al menos nos aseguramos que sólo vamos a cambiar el `state` desde las `mutations`. Por lo tanto, los datos siempre "fluyen" en un mismo sentido. De ahí, el término "flux":

> The most important concept is that **data flows in one direction**

Fuente: https://github.com/facebook/flux/tree/master/examples/flux-concepts

## State

Es donde definimos nuestro estado inicial. Se define como una función que devuelve un Objeto.

## Getters

Vuex nos brinda unos "helpers" para acceder a partes del estado. Podemos considerar a los "getters" de Vuex como las "computed properties" de los componentes. Pero en este caso, no podemos hacer un "setter", sólo acceder a valores de forma reactiva.

Vamos a ver una implementación de un store completo:

En nuestro `src/store/index.ts`, añadiremos un nuevo módulo:

```diff
  import { createStore } from 'vuex'
+ import CartModule from './Cart'

  export default createStore({
-   state: {},
-   mutations: {},
-   actions: {},
-   modules: {},
+   modules: {
+     CartModule,
+   },
  })
```

Que irá en `src/store/Cart/index.ts`.

En vez de definir un store en el "root level", separaremos nuestros `Stores` en módulos. Así, estará más compartimentada nuestra app.

El `` tendrá la siguiente estructura:

```ts
import {
  Module,
  MutationTree,
  ActionTree,
  GetterTree,
  ActionContext,
} from 'vuex'

const state: () => CartState = () => ({
  /* ... */
})
const getters: GetterTree<CartState, unknown> & CartGetters = {
  /* ... */
}
const mutations: MutationTree<CartState> & CartMutations = {
  /* ... */
}
const actions: ActionTree<CartState, unknown> & CartActions = {
  /* ... */
}

const CartModule: Module<CartState, unknown> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default CartModule
```

Vemos que se compone de `state`, `getters`, `mutations` y `actions`.

Iremos poco a poco, rellenando esos huecos: `/* ... */`

Vamos a empezar por definir los tipos de mi estado:

```ts
export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export interface CartState {
  items: CartItemRecord
}
```

Será, de momento, un objeto (`Record`), con `id`s como `keys` y un `CartItem` como `value`. El cual, tiene dos propiedades: `quantity` y `data`. Aunque la palabra `data` puede que no sea el mejor nombre, podría haber sido `product`.

Las `mutations`, `actions` y `getters` son objetos que tienen funciones. En el tipado de la librería los definen como "Trees": `MutationTree`, `ActionTree` y `GetterTree`.

Pero, para simplificar la explicación de Vuex, creo que primero vamos a implementar el store sin tipado. Y se lo añadiremos a continuación. Si queréis ver un ejemplo del sotre con tipado completo podéis ver la implementación en: https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/03-vue/01_ecommerce_app_final/src/store/Cart
