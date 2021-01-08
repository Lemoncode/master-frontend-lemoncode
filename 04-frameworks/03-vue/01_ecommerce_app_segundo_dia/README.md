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
