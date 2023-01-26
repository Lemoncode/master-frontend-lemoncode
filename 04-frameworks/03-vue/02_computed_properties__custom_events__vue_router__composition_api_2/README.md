# ecommerce-app

Vamos a seguir con la aplicación donde la dejamos en la primera sesión. De momento,

- [x] hemos hecho el _bootstrapping_ de una app con Nuxt
- [x] hemos borrado el componente de `NuxtWelcome`
- [x] hemos creado un componente Header que se pinta en todas las vistas.
- [x] hemos añadido estilos globales.
- [x] hemos añadido un servicio (mock) que nos devuelve una JSON
- [x] y hemos añadido el primer componente que hace una llamada a esa lista y la pinta en la vista

Hoy el objetivo es:

- [ ] Ver otras features de _Vue_ como "computed properties", "props", "dynamic attributes binding", "custom events"
- [ ] Añadir una página nueva.
- [ ] Haremos un poquito de _refactor_ de nuestra app para usar más la "Composition API".

## `fetch` -> `$fetch`

En nuestro servicio, hemos usado `fetch`. Pero, de momento, el soporte en Node.js es experimental para alguna de las APIs de `fetch`. Por eso, en el _server-side rendering_ lo recomendado es usar `$fetch`, que es una función que nos proporciona Nuxt.

````diff

```diff
// services/products.ts
- import { Product } from '@/types'
+ import { ProductsApiResponse } from '~~/types'

export const productService = {
  async get() {
-    const { products } = await fetch('https://dummyjson.com/products').then(
-      (r) => r.json()
-    )
-    return products as Product[]
+    const { products } = await $fetch<ProductsApiResponse>(
+      'https://dummyjson.com/products'
+    )
+    return products
  },
}
````

Notad como hemos tenido que cambiar un poco el tipado, ya que `$fetch` usa un tipo genérico para tipar la respuesta.

## Computed

Vamos a empezar por añadir una [_computed property_](https://vuejs.org/guide/essentials/computed.html).

En el componente de `ProducList`, añadimos el siguiente _markup_:

```diff
<template>
+  <section class="wrapper">
+    <div class="flex align-items-center justify-content-between">
+      <h1>Products</h1>
+      total: {{ totalProducts }}
+    </div>
+
...    <!-- aquí nuestra lista con ul>li... -->
+  </section>
</template>
```

Hemos encerrado todo en un `wrapper` por semántica (`section`) y para aplicar estilos, si quisiéramos a la clase `.wrapper`.

Hemos añadido una nueva propiedad en la plantilla llamada `totalProducts`.

Vamos a crear una computed property en la plantilla con este nombre para mostrar el total de resultados:

```diff
+ const totalProducts = computed(() => list.length)
```

Ahora deberíamos ver en la interfaz un "total: 30". Vemos que una computed property nos sirve para definir de manera reactiva, "estado derivado" en nuestros componentes. Es una función porque se ejecuta al crearse el componente y cada vez que cambia una de sus "dependencias", en este caso, `list`. Como vimos en la sesión anterior, no se le pasan parámetros.

Vamos a ver otro ejemplo de computed property muy común: crearemos un componente nuevo al que le pasaremos `props` y a esa `prop` le vamos a aplicar una transformación para pintarlo en la vista.

De esta manera le quitamos responsabilidad a `ProductList` a la hora de cómo renderizar algunas cosas. Imaginemos que tenemos la app en España, con Euros, pero para otro país mostramos dólares también. Nuestro componente de precios puede pintar una u otra moneda. Para ello, usaremos el objeto de JS `Intl`.

Esta es la implementación del componente:

- `components/StaticPrice.vue`

```vue
<template>
  <div>
    {{ parsedPrice }}
  </div>
</template>

<script lang="ts" setup>
type Coin = 'EUR' | 'USD'

const props = withDefaults(
  defineProps<{
    quantity: number
    coin?: Coin
  }>(),
  {
    coin: 'EUR',
  }
)

const locale = computed(() => {
  switch (props.coin) {
    case 'USD':
      return 'en-US'
    default:
      return 'es-ES'
  }
})

const parsedPrice = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: props.coin,
  }).format(props.quantity)
})
</script>
```

Vemos un par de cosas interesantes aquí, a parte del objeto `Intl`:

- Usamos los métodos auto-importados de `withDefaults` y `defineProps` para tipar las `props` y darles un valor por defecto. Además, al definir una de las props como opcional en la interfaz que se le pasa a `defineProps`, damos a entender que no es necesaria para el componente.
- Tenemos varias `computed properties`. Y algunas hacen uso de otras.

Cabe notar, que tenemos que asignarlo a una variable `props`, que es la que usamos para referenciar las props dentro de `<script setup>`.

Vamos a añadir este componente en `ProductList`:

```diff
-              {{ product.price }}
+              <StaticPrice :quantity="product.price" />
```

Ahora deberíamos ver nuestros precios pintados como dicta cada moneda.

Vamos a crear otro componente!

## Custom Events

Vamos a añadir un botón para añadir nuestros productos al "carrito". Añadimos otro componente llamado `AddToCartButton.vue`.

Quizá de momento, no tiene mucho sentido: estamos recibiendo el objeto de producto como `prop` y al clickar, lanzamos un evento con el mismo objeto "p'arriba". Podríamos no estar pasando el objeto y añadir el event listener de click al nivel de `ProductList`, pero al igual que con el `StaticPrice.vue`

- `components/AddToCartButton.vue`:

```vue
<template>
  <button class="button" type="button" @click="addItem">Add to Cart</button>
</template>

<script lang="ts" setup>
import { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const $emit = defineEmits(['add-item'])

const addItem = () => {
  $emit('add-item', props.product)
}
</script>
```

Vemos que el `$emit` es quien nos permite comunicarnos entre componentes hijo-padre.

Algo nuevo en la syntaxis de `script setup` es que tenemos que definir de manera explícita los eventos con `defineEmits`.

Vamos a recibir ese "mensaje" (_evento_) en `ProductList`:

```diff
          <div class="flex product-container__aside">
            <div class="text-align-end aside__price">
              <StaticPrice :quantity="product.price" />
            </div>
+           <AddToCartButton :product="product" @addItem="onAddItem" />
          </div>

```

La parte que más nos interesa es `@addItem="onAddItem"`. Es lo mismo que escribir:

- `@addItem="onAddItem($event)"`
- ó `@addItem="$event => onAddItem($event)"`

Pero si sabéis suficiente JS, sabréis que es el equivalente de escribir: `@addItem="onAddItem"`. Los parámetros se pasan por defecto.

En `ProductList` toca implementar el _callback_ `onAddItem`. Añadimos lo siguiente en nuestro componente:

```diff
+ const onAddItem = (product: Product) => {
+   console.log('onAddItem', product)
+ }
```

## Binding de atributos dinámicos

En cada objeto "Product" hay información sobre sus descuentos. Vamos a darles algún distintivo para que se vea desde la vista. Por ejemplo, un color diferente (UX... :P)

Dentro de cada `li`, al `article` le vamos a "bindear" una clase.

```diff
-        <article class="grid product-container card">
+        <article
+          class="grid product-container card"
+          :class="{
+            'product-container--has-discount': product.discountPercentage > 15,
+          }"
+        >

```

Podemos bindear cualquier atributo de manera dinámica, pero `:class` es un poco especial. Lo más normal es que le pasemos un objeto.

- Las `keys` son las clases a asignar
- el `value` es una expresión de JS que se analiza como booleana. Si es "truthy", se asigna la clase; si no, se borra o no se llega a asignar. De esta manera podemos hacer `toggling` de clases en Vue.

Añadiremos esa clase en los estilos:

```scss
/* Por ejemplo: */
.product-container--has-discount {
  background-color: rgba(yellow, 0.5);
}
```

Podemos bindear estilos directamente también, si lo necesitamos, pero es más común colocar los estilos en los SFC en la sección de estilos, ya que gracias a los "`scoped` styles", no necesitamos usar estilos en línea. Pero si quisíeramos asignar una `background-image`, con un valor dinámico, por ejemplo, haríamos:

```vue
<template>
  <!-- ESTE ES SOLO UN EJEMPLO -->
  <div
    class="card"
    :style="{
      backgroundImage: `url(${imageSrc})`,
      backgroundPosition: 'center',
    }"
  >
    <!-- ... -->
  </div>
</template>
```

Como vemos, usa sintaxis de objetos de JS.

Para bindear cualquier otro atributo, usaremos la directiva `v-bind`. Pero os dejo unos enlaces, ya que ahora no lo vamos a ver:

- https://vuejs.org/guide/essentials/class-and-style.html#class-and-style-bindings
- https://vuejs.org/api/built-in-directives.html#v-bind

## Dynamic routes

Por último, en la sesión de hoy vamos a añadir una ruta nueva en nuestra página. Será la ruta "detalle" de cada elemento de la lista, la página de cada producto.

Para ello, vamos a ańadir la carpeta `/pages` y dentro de ella, el archivo `product/[id].vue`.

También, vamos a mover nuestro app.vue a la carpeta `/pages` y renombrarlo a `index.vue`. Ya que, a partir de ahora, vamos a usar el archivo `index.vue` como el punto de entrada del router de la aplicación.

Volvemos a `product/[id].vue`. Los corchetes indican que es una ruta dinámica. Dentro de los corchetes usamos el nombre de la variable se pasa como parámetro en la URL.

Por ejemplo, esa estructura de carpetas y archivos nos permitirá acceder a la página de un producto con la URL `/product/42`.

Vamos a implementar la vista de detalle:

```vue
<template>
  <div class="container">
    <NuxtLink to="/" class="back">⬅️ Go back</NuxtLink>
    <article>
      <div>
        <img :src="product?.images[0]" alt="" />
      </div>
      <div v-if="product">
        <h1>{{ product.title }}</h1>
        <p class="flex">
          Price:&nbsp;<StaticPrice :quantity="product.price" />
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { productService } from '~~/services/products'
import { Product } from '~~/types'

const route = useRoute()
const id = route.params.id as string

const { data: product } = useAsyncData<Product>(() =>
  productService.getProductById(id)
)
</script>

<style scoped>
.back {
  display: block;
  margin: 1rem 0;
}
</style>
```

- Vemos que estamos usando el composable `useAsyncData` para hacer una llamada a la API, con nuestro servicio `productService`. Y usamos un método, `getProductById`, que no hemos creado todavía. Enseguida lo implementaremos.
- También, estamos usando el componente `StaticPrice`, que acabamos de crear anteriormente.
- La plantilla no tiene mucho de momento, una imagen, el título y el precio...

Ahora, haremos que al clickar en un producto nos lleve a la página de detalle: En `ProductList`, para ello, encerraremos a cada `article > li` en un `<NuxtLink>`. Este componente es un componente de Nuxt, que nos permite navegar entre páginas de la aplicación, sin recargar la página. Es, en realidad, un "wrapper" del componente `<router-link>` de la librería de Vue Router.

```diff
+        <NuxtLink :to="`/product/${product.id}`">
...        <!--  <article>...</article> -->
+        </NuxtLink>
```

En el código compilado esto se comportará como un link normal (`<a>`), pero será Javascript el que haga la navegación, usando la History API.

De esta manera, mantenemos nuestro markup semántico.

Una cosa a tener en cuenta: dentro de cada elemento de la lista teníamos un botón de añadir a carrito. Si queremos que al clickar en el botón, el evento (del DOM) no se propague y el `NuxtLink` reciba el click tenemos que especificarlo:

- En `AddToCartButton.vue`, cambiamos el evento click:

```diff
-  <button class="button" type="button" @click="addItem()">
+  <button class="button" type="button" @click.prevent="addItem()">
```

Como decíamos, tenemos que implementar el método `productService.getProductById` o de lo contrario, nos saltará un error.

Con la API que estamos usando, haremos uso de un endpoint diferente para hacer una query en el lado del servidor.

Añadimos una propiedad más en el objeto, `getProductById`:

```ts
// services/products.ts
export const productService = {
  // ...async get() {},
  async getProductById(id: string) {
    const product = await $fetch<Product>(
      `https://dummyjson.com/products/${id}`
    )
    return product
  },
}
```

Una vez hecho esto, ya podemos ver la página de detalle de un producto. Pero, si nos fijamos, nos falta el Header que tenemos en la página de inicio. Vamos a añadirlo.

La manera de compartir partes de la plantilla entre páginas es usando `layouts`. En Nuxt, los layouts son componentes de Vue que se renderizan alrededor de las páginas. Por ejemplo, podemos tener un layout para la página de inicio, y otro para la página de detalle de un producto, pero en este caso vamos a usar la misma.

Creamos un layout en `layouts/default.vue`:

```vue
<template>
  <div id="app">
    <Header />
    <main>
      <slot />
    </main>
  </div>
</template>
```

Al llamarlo "default", estamos indicando que es el layout por defecto. Si no especificamos un layout, se usará este en todas las páginas.

Vemos que usa un `<slot>` para renderizar el contenido de cada página.

Como le hemos añadido el id `app` al layout, tenemos que eliminarlo en la página de inicio (`pages/index.vue`). Y también, tenemos que eliminar el `Header`, ya que lo estamos renderizando en el layout.

```diff
<template>
-  <div id="app">
+  <div>
-    <Header />
    <ProductList />
  </div>
</template>
```

## Composables

Por hoy, como hemos dicho al principio, no vamos a añadir más features en la app de ecommerce. Pero vamos a empezar a usar la nueva tecnología de Vue 3: Composition API, para crear "composables"

Volvemos a los slides, para ver una pequeña introducción.

El único problema es que hemos dado con un caso particular. Cuando utilizamos `script setup` con Tol level `await`, tenemos que englobar el componente en un `Suspense` para que funcione.

Pero lo bueno es que Nuxt ya lo hace por nosotros, si usamos el top level `await` en el `script setup` de una página o componente.

Ahora, si queremos, podemos extraer de `ProductList` la lógica de la llamada a la API a su propio "módulo". Normalmente se estructuran estos archivos en una carpeta `use/` o en `composables/`. Pero la arquitectura está abierta a diferentes implementaciones. Por ejemplo, podemos optar a separar features por "dominios", siguiendo DDD.

El `script` de nuestro `ProductList` quedaría así:

```diff
<script setup lang="ts">
import { Product } from '@/types'
- import { productService } from '@/services/products'
+ import useProductsApi from '@/composables/useProductsApi'

- const list = await productService.get()
- const totalProducts = computed(() => list.length)

+ const { list, totalProducts } = await useProductsApi()

// ...
</script>
```

De esta manera, el componente no tiene tanta responsabilidad como tenía antes. Lo que se llama _Dependency Inversion_, si no me equivoco. Ahora, hemos "abstraído" la responsabilidad de la llamada a la API y su implementación a otro módulo.

## Pinia

Vamos a empezar por añadir un "Store", como habréis visto en otros frameworks, Pinia sirve para controlar la gestión de estado global de la aplicación.

Os lo enseño con un gráfico: https://miro.com/app/board/o9J_lZFBPQQ=/

Pinia "se sienta" horizontalmente en la app y desde cualquier componente (o página) podemos acceder a los datos que allí guardamos.

Los datos siempre deben fluir en el mismo sentido: `actions ->  state`. Os recordará a Redux, seguramente. Y es que Pinia, Vuex y Redux están basados en la ["Flux Arquitecture"](https://facebook.github.io/flux/).

### Instalación

Para instalarlo, ejecutamos:

```bash
yarn add pinia @pinia/nuxt
# or with npm
npm install pinia @pinia/nuxt
```

Docs: https://pinia.vuejs.org/ssr/nuxt.html

## Actions

Desde los componentes (o páginas) llamamos a "actions", para que se ejecute un cambio de estado.

Las `actions` deberían describir acciones que se realizan en la interfaz, como "addToCart()".

## State

Es donde definimos nuestro estado inicial. Se define como una función que devuelve un Objeto.

Gracias a que usamos Pinia, el estado es reactivo, por lo que si lo cambiamos , se actualizará en la interfaz.

## Getters

Pinia nos brinda unos "helpers" para acceder a partes del estado. Podemos considerar a los "getters" de Vuex o Pinia como las "computed properties" de los componentes. Pero en este caso, no podemos hacer un "setter", sólo acceder a valores de forma reactiva.

Vamos a ver una implementación de un store completo:

En nuestra carpeta de `composables/`, añadiremos un nuevo módulo llamado `useCartStore.ts`:

```ts
import { defineStore } from 'pinia'
import { Product } from '~~/types'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: {} as CartItemRecord,
  }),
  getters: {
    totalItems: (state) =>
      Object.values(state.items).reduce((acc, item) => {
        return acc + item.quantity
      }, 0),
  },
  actions: {
    addItem(item: Product) {
      this.items[item.id] = {
        quantity: this.items[item.id]?.quantity + 1 || 1,
        data: item,
      }
    },
  },
})
```

Vamos a ver una feature muy importante de Vue: `v-model` (formularios, en general).

Vamos a empezar por `v-model`

### `v-model`

`v-model` es la manera de sincronizar los formularios de la interfaz con el estado de nuestra aplicación. Lo veremos normalmente asociado a `<input>`s, `<textarea>`s y `<select>`s...; pero también en componentes propios asociados a estos elementos típicos de los formularios.

Vemos un ejemplo:

```vue
<template>
  <input type="text" v-model="myName" />
  <p>Mi nombre es: {{ myName }}</p>
</template>

<script setup>
import { ref } from 'vue'
const myName = ref('Pepe')
</script>
```

Cada vez que l@s usuari@s cambien el valor del input (escribiendo), el estado del componente cambiara acorde.

Asímismo, cada vez que cambie el valor `myName` dentro de nuestro componente (imaginad, en un `method`), cambiaría el formulario en la interfaz también. Por eso lo llaman "2 way", cambie uno u otro, actualizará su reflejo.

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

## Parte práctica

Para la sesión de hoy no la voy a dejar definida con los pasos en el README. Pero podéis ver exactamente los cambios que haremos en estos commits:

### v-model

- "añadir filtro de lista con v-model" [c133ed1](https://github.com/Lemoncode/master-frontend-lemoncode/commit/c133ed1)
