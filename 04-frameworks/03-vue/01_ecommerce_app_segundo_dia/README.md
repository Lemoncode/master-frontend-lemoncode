# ecommerce-app

Vamos a seguir con la aplicación donde la dejamos en la primera sesión. De momento,

- hemos hecho el _bootstrapping_ de una app con Vue CLI
- hemos borrado los archivos que venían por defecto ("assets", "components", "views"...)
- hemos añadido un servicio "dummy" que nos devuelve una JSON
- y hemos añadido el primer componente que hace una llamada a esa lista y la pinta en la vista

Hoy el objetivo es:

- Ver otras features de _Vue_ como "computed properties", "dynamic attributes binding", "custom events"
- Añadir una página nueva en _Vue Router_.
- Haremos un poquito de _refactor_ de nuestra app para usar la "Composition API"

## Dynamic import -> `fetch`

El ejemplo de dynamic import que hicimos en el servicio era solo para enseñaros cómo usar Dynamic Imports en general.
Si tenéis alguna duda al respecto, preguntadme.

Pero en un servicio web lo más normal es que usemos `fetch` o alguna librería de peticiones http. Vamos a hacer un pequeño refactor en el servicio para que se parezca más a un caso del mundo real:

```diff
// services/products.ts
import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
-    const books: Product[] = await import(
-      /* webpackChunkName: "books" */ './books.mock.json'
-    ).then(module => module.default)
+    const books: Product[] = await fetch('./books.mock.json').then(response =>
+      response.json()
+    )
    return books
  },
}

```

Deberíamos ver que en vez de crearse un chunk con el nom bre que le habíamos puesto en el _Webpack Magic Comment_, se está haciendo una llamada http a un archivo JSON.

## Computed

Vamos a empezar por añadir una [_computed property_](https://vuejs.org/v2/guide/computed.html#Computed-Properties).

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

```ts
  computed: {
    totalProducts(): number {
      return this.list.length
    },
  },
```

Ahora deberíamos ver en la interfaz un "total: 100". Vemos que una computed property nos sirve para definir de manera reactiva, "estado derivado" en nuestros componentes. Es una función porque se ejecuta al crearse el componente y cada vez que cambia una de sus "dependencias", en este caso `this.list`. Como vimos en la sesión anterior, no se le pasan parámetros.

Vamos a ver otro ejemplo de computed property muy común: crearemos un componente nuevo al que le pasaremos `props` y a esa `prop` le vamos a aplicar una transformación para pintarlo en la vista.

De esta manera le quitamos responsabilidad a `ProductList` a la hora de cómo renderizar algunas cosas. Imaginemos que tenemos la app en España, con Euros, pero para otro país mostramos dólares también. Nuestro componente de precios puede pintar una u otra moneda. Para ello, usaremos el objeto de JS `Intl`.

Esta es la implementación del componente:

- `src/components/StaticPrice.vue`

```vue
<template>
  <div>
    {{ parsedPrice }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type Coin = 'EUR' | 'USD'

export default defineComponent({
  props: {
    quantity: {
      type: String,
      required: true,
      default: '',
    },
    coin: {
      type: String as PropType<Coin>,
      default: 'EUR',
      validator(value: Coin) {
        return ['EUR', 'USD'].includes(value)
      },
    },
  },
  computed: {
    floatPrice(): number {
      return parseFloat(String(this.quantity).replace(',', '.'))
    },
    // TODO: make locale a global property using vue-i18n
    // not always a currency is bound to a country/language
    locale(): string {
      return this.coin === 'EUR' ? 'es-ES' : 'en-US'
    },
    parsedPrice(): string {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.coin,
      }).format(this.floatPrice)
    },
  },
})
</script>
```

Vemos un par de cosas interesantes aquí, a parte del objeto `Intl`:

- En las props estamos usando un `validator` propio. Para comprobar que solo recibimos 2 valores. De no ser así, Vue lanzaría un error en la consola en entorno de desarrollo.
- Tenemos varias `computed properties`. Y algunas hacen uso de otras.

Cabe notar, que a pesar de que son funciones, accedemos a ellas como propiedades de un objeto. ¿Por qué? Porque lo que hace Vue es convertirlas en `getters`/`setters`.

Vamos a añadir este componente en `ProductList`:

```diff
-              {{ product.price }}
+              <StaticPrice :quantity="product.price" />
```

Y no nos olvidemos de importarlo y añadirlo en la sección de `components`:

```vue
<script>
import StaticPrice from '@/components/StaticPrice.vue'

export default defineComponent({
  components: { StaticPrice },
  // ...
)}
</script>
```

Ahora deberíamos ver nuestros precios pintados como dicta cada moneda.

Vamos a crear otro componente!

## Custom Events

Vamos a añadir un botón para añadir nuestros productos al "carrito". Añadimos otro componente llamado `AddToCartButton.vue`.

Quizá de momento, no tiene mucho sentido: estamos recibiendo el objeto de producto como `prop` y al clickar, lanzamos un evento con el mismo objeto "p'arriba". Podríamos no estar pasando el objeto y añadir el event listener de click al nivel de `ProductList`, pero al igual que con el `StaticPrice.vue`

- `src/components/AddToCartButton.vue`:

```vue
<template>
  <button class="button" type="button" @click="addItem()">
    Add to Cart
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Product } from '@/types'

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },
  methods: {
    addItem(): void {
      this.$emit('add-item', this.product)
    },
  },
})
</script>
```

Vemos que el `$emit` es quien nos permite comunicarnos entre hijo-padre.

Vamos a recibir ese "mensaje" (evento) en `ProductList`:

```diff
          <div class="flex product-container__aside">
            <div class="text-align-end aside__price">
              <StaticPrice :quantity="product.price" />
            </div>
+           <AddToCartButton :product="product" @addItem="onAddItem" />
          </div>

```

No nos olvidemos de inluirlo en `components: {...}`

La parte que más nos interesa es `@addItem="onAddItem"`. Es lo mismo que escribir:

- `@addItem="onAddItem($event)"`
- ó `@addItem="$event => onAddItem($event)"`

Pero si sabéis suficiente JS, sabréis que es el equivalente de escribir: `@addItem="onAddItem"`. Los parámetros se pasan por defecto.

En `ProductList` toca implementar el _callback_ `onAddItem`. Añadimos lo siguiente en nuestro componente:

```diff
  methods: {
    onAddItem(product: Product) {
      console.log(product.title)
    },
  },
```

## Binding de atributos dinámicos

En cada objeto Product hay información sobre sus descuentos. Vamos a darles algún distintivo para que se vea desde la vista. Por ejemplo, un color diferente (UX... :P)

Dentro de cada `li`, al `article` le vamos a "bindear" una clase.

```diff
-        <article class="grid product-container card">
+        <article
+          class="grid product-container card"
+          :class="{
+            'product-container--has-discount': product.discount !== '0.0',
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
  <div
    class="card"
    :style="{
      backgroundImage: `url(${this.imageSrc})`,
      backgroundPosition: 'center',
    }"
  >
    <!-- ... -->
  </div>
</template>
```

Como vemos, usa sintaxis de objetos de JS.

Para bindear cualquier otro atributo, usaremos la directiva `v-bind`. Pero os dejo unos enlaces, ya que ahora no lo vamos a ver:

- https://v3.vuejs.org/guide/class-and-style.html#class-and-style-bindings
- https://v3.vuejs.org/api/directives.html#v-bind

Nota: son enlaces de la documentación de v3, tal y como está publicada ahora. En el futuro puede que la URL sea diferente: sin el subdominio `v3`.

## Dynamic routes

Por último, en la sesión de hoy vamos a añadir una ruta nueva en nuestra página. Será la ruta "detalle" de cada elemento de la lista, la página de cada producto.

en nuestro `src/router/index.ts`, vamos a añadir un registro nuevo:

```diff
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
+ {
+   path: '/detail/:id',
+   component: () => import('../views/Detail.vue'),
+   name: 'Detail',
+ },
]
```

La ruta será `/detail/` y el `id` de cada `Product`. Por ejemplo, en desarrollo: `http://localhost:8080/detail/42`.

Un detalle muy importante a tener en cuenta es el uso de synamic imports. Eso hará que cuando webpack compile nuestra aplicación, no inlcuya esa vista en el _bundle_ principal, sino como un "chunk" separado: no queremos que se carguen todas las páginas de primeras, por temas de _performance_.

Vamos a implementar la vista de `Detail` en `src/views/Detail.vue`:

```vue
<template>
  <div class="grid">
    <div>
      <img :src="`https://picsum.photos/id/${id}/600`" alt="" />
    </div>
    <div v-if="product">
      <h1>{{ product.title }}</h1>
      <p class="flex">Price:&nbsp;<StaticPrice :quantity="product.price" /></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocation } from 'vue-router'
import { Product } from '@/types'
import { productService } from '@/services/products'

import StaticPrice from '@/components/StaticPrice.vue'

export default defineComponent({
  components: {
    StaticPrice,
  },
  data: () => ({
    product: {} as Product,
  }),
  computed: {
    id(): string {
      return String((this.$route as RouteLocation).params.id)
    },
  },
  created() {
    productService.getProduct(this.id).then((product: Product | undefined) => {
      if (product) {
        this.product = product
      }
    })
  },
})
</script>
```

- Vemos que estamos usando el lifeclycle hook `created` para hacer una llamada a la API, con un método del `productService` que no hemos creado todavía. Enseguida lo implementaremos.
- Hacemos uso de `computed properties` una vez más para reasignar datos de la instancia del componente.
- La plantilla no tiene mucho de momento, una imagen, el título y el precio...

No he conseguido hacer funcionar correctamente el Router con TS... TS + Vue 3 de manera global, por eso estaba importando los tipos aquí :(

Ahora, haremos que al clickar en un producto nos lleve a la página de detalle: En `ProductList`, para ello, encerraremos a cada `article > li` en un `<router-link>`. Es un componente que registra Vue Router de manera global, al igual que `<router-view />`:

```diff
+        <router-link :to="`/detail/${product.id}`">
...        <!--  <article>...</article> -->
+        </router-link>
```

En el código compilado esto se comportará como un link normal (`<a>`), pero será Javascript el que haga la navegación, usando la History API.

De esta manera, mantenemos nuestro markup semántico.

Una cosa a tener en cuenta: dentro de cada elemento de la lista teníamos un botón de añadir a carrito. Si queremos que al clickar en el botón, el evento (del DOM) no se propague y el `router-link` reciba el click tenemos que especificarlo:

- En `AddToCartButton.vue`, cambiamos el evento click:

```diff
-  <button class="button" type="button" @click="addItem()">
+  <button class="button" type="button" @click.stop="addItem()">
```

Como decíamos, tenemos que implementar el método `productService.getProduct` o de lo contrario, nos saltará un error.

Vamos a hacer el filtrado en cliente, aunque normalmente sería un endpoint diferente para hacer una query en el lado del servidor o algo similar:.

Añadimos una propiedad más en el objeto

```ts
// src/services/products.ts
export const productService = {
  // ...async get() {},
  async getProduct(id: Product['id']): Promise<Product | undefined> {
    if (!id) throw new Error('id is required')
    // usamos el mismo `get` que ya teníamos
    return this.get().then(list => {
      return list.find((item: Product) => String(item.id) === String(id))
    })
  },
}
```

### `Unexpected token < in JSON at position 0`

En este punto me dio un error el `fetch`: `Unexpected token < in JSON at position 0`. Podemos solucionarlo de la siguiente manera:

- Movemos el `json` a la carpeta `/public`, que para eso está: _assets_ estáticos.
- Y haremos los siguientes cambios en el método `get()`:

```diff
-    const books: Product[] = await fetch('./books.mock.json', {
+    const books: Product[] = await fetch('/books.mock.json', {
+      headers: {
+        Accept: 'application/json',
+      },
     }).then(response => response.json())
     return books
```

Hemos cambiado la ruta relativa a una absoluta y le especificamos el tipo de contenido que solicitamos.

El _product service_ quedaría así:

```ts
import { Product } from '@/types'

export const productService = {
  async get(): Promise<Product[]> {
    const books = await fetch('/books.mock.json', {
      headers: {
        Accept: 'application/json',
      },
    }).then(m => m.json())
    return books
  },
  async getProduct(id: Product['id']): Promise<Product | undefined> {
    if (!id) throw new Error('id is required')
    return this.get().then(list => {
      return list.find((item: Product) => String(item.id) === String(id))
    })
  },
}
```

## Vue 3

Por hoy, como hemos dicho al principio, no vamos a añadir más features en la app de ecommerce. Pero vamos a empezar a usar la nueva tecnología de Vue 3: Composition API.

Volvemos a los slides, para ver una pequeña introducción.

---

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
