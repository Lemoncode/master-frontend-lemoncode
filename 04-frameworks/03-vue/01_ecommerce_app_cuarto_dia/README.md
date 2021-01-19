# ecommerce-app

En la última clase no nos dio tiempo de ver Vuex demasiado bien. Hemos preparado una clase para abordar esto y además añadir una feature muy importante de Vue: `v-model` (formularios, en general).

Vamos a empezar por `v-model`

## `v-model`

`v-model` es la manera de sincronizar los formularios de la interfaz con el estado de nuestra aplicación. Lo veremos normalmente asociado a `<input>`s, `<textarea>`s y `<select>`s...; pero también en componentes propios asociados a estos elementos típicos de los formularios.

Vemos un ejemplo:

```vue
<template>
  <input type="text" v-model="myName" />
  <p>Mi nombre es: {{ myName }}</p>
</template>

<script>
export default {
  data() {
    return {
      myName: '',
    }
  },
}
</script>
```

Cada vez que l@s usuari@s cambien el valor del input (escribiendo), el estado del componente cambiara acorde.

Asímismo, cada vez que cambie el valor `myName` dentro de nuestro componente (imaginad, en un `method`), cambiaría el formulario en la interfaz también. Por eso lo llaman "2 way", cambie uno u otro, actualizará su reflejo.

```diff
  <template>
    <input type="text" v-model="myName" />
    <p>Mi nombre es: {{ myName }}</p>
  </template>

  <script>
  export default {
    data() {
      return {
        myName: '',
      }
    },
+   mounted() {
+     this.myName = 'algo'
+   }
  }
</script>
```

Veríamos en la interfaz que el input tiene el valor `algo`.

Algo a tener en cuenta, para finalizar la introducción a `v-model` es: v-model, en realidad es el equivalente a hacer:

```vue
<template>
  <textarea :value="myValue" @input="myValue = $event" />
</template>
```

Tened en cuenta que:

- el evento `input` (en _Vanilla Javascript_) lo usaríamos en `input`s y `textarea`s
- pero en un `select` sería el evento `change`...

`v-model` trata todos los casos de los elementos relacionados con los formularios.

## Vuex

> Esta sección completa está sacada de [la última sesión literalmente](../01_ecommerce_app_tercer_dia/README.md)

Vamos a empezar por añadir un "Store", como habréis visto en otros frameworks, vuex sirve para controlar la gestión de estado global de la aplicación.

Os lo enseño con un gráfico: https://miro.com/app/board/o9J_lZFBPQQ=/

Vuex "se sienta" horizontalmente en la app y desde cualquier componente (o página) podemos acceder a los datos que allí guardamos.

Los datos siempre deben fluir en el mismo sentido: `actions -> mutations -> state`. Os recordará a Redux, seguramente. Y es que Vuex y Redux están basados en la ["Flux Arquitecture"](https://facebook.github.io/flux/).

### Actions

Desde los componentes (o páginas) llamamos a "actions", para que se ejecute un cambio de estado. Las `actions` son asíncronas. Por lo tanto, es donde mucha gente coloca llamadas asíncronas. Pero mover toda la lógica de llamadas asíncronas a Vuex... está bien para proyectos pequeños o medianos, en mi opinión. Personalmente, prefiero usar servicios como hemos hecho en nuestra app de ecommerce.

Las `actions` deberían describir acciones que se realizan en la interfaz, como "addToCart()".

### Mutations

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

### State

Es donde definimos nuestro estado inicial. Se define como una función que devuelve un Objeto.

### Getters

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

Perp, para simplificar la explicación de Vuex, creo que primero vamos a implementar el store sin tipado. Y se lo añadiremos a continuación

## Vuex + v-model!

Os voy a enseñar un patrón interesante.

Qué pasaría si queremos hacer que cada vez que cambie un valor en un formulario, se actualice el valor en el `Store`.

Recordemos que `computed` es definido como una función:

```js
{
  // ...
  computed: {
    myComputedProp() {
      return __something__
    }
  }
}
```

Recordad que `data` y `computed` son reactivos en Vue gracias a `getters`/`setters` (`Proxies` en Vue 3) que añade la librería "por debajo" ("invisible" para el usuario). Con `computed` tenemos una manera de definirlos **explícitamente** ([documentación](https://vuejs.org/v2/guide/computed.html#Computed-Setter)), de esta manera haríamos que una propiedad de `computed` tenga una manera de ser asignada directamente. Para l@s que conozcáis los _Proxies_, sería como hacer una `set trap` o una `get trap`.

```vue
<script>
export default {
  computed: {
    // Fijaros que no lo definimos como función, sino como objeto!
    myComputedProp: {
      get() {
        // este `__algo__` tiene que vivir en algún lugar: puede ser en el componente o fuera (en Vuex, por ejemplo)
        return __algo__
      },
      set(val) {
        __algo__ = val
      },
    },
  },
}
</script>
```

Recordemos que los `getters`/`setters` son propios de Objetos en Javascript, como vimos en [../00_que_es_vue/01_reactividad](../00_que_es_vue/01_reactividad)
