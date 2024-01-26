# ecommerce-app

## Persistencia de estado

Vamos a terminar lo que no nos dio tiempo de ver el otro día. Vamos a persistir el estado de la aplicación. Para ello vamos a utilizar el paquete [@vueuse/core](github.com/vueuse/vueuse) que nos va a permitir utilizar el composable `useLocalStorage` con el que podemos guardar el estado de la aplicación en el `localStorage` del navegador.

Primero necesitamos instalar el paquete:

```bash
npm install @vueuse/core
# or
yarn add @vueuse/core
```

Y ahora vamos a editar nuestro _store_ de carrito:

```diff
+ import { useLocalStorage } from '@vueuse/core'
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
+       // Rewrite the localStorage
+       useLocalStorage('cart', this.items)
      },
    },
+    hydrate(store) {
+      // Load items from localStorage
+      store.items = useLocalStorage('cart', {} as CartItemRecord).value
+    },
  })
```

Ahora, cuando añadimos un producto al carrito, lo que hacemos es guardar el estado del carrito en el `localStorage` del navegador.

Y cuando inicializamos el store, lo que hacemos es cargar el estado del carrito desde el `localStorage` del navegador, gracias a la función `hydrate` de Pinia.

Fijaros que al usar `useLocalStorage` lo hacemos de la siguiente forma:

```ts
useLocalStorage('cart', {} as CartItemRecord)
```

- El primer parámetro es el nombre de la clave en el `localStorage`, que en este caso es `cart`,
- y el segundo es el "valor por defecto" que va a tener esa clave si no existe. Es obligatorio pasarle un valor por defecto, por cómo está implementado el composable.

Con esto ya tenemos persistido el estado de la aplicación (**en el cliente**). Si recargamos la página, el estado del carrito se mantiene. Y es hasta aquí lo que os quería enseñar el otro día! 🎉

Os dejo los enlaces a la documentación de Pinia y de Vueuse:

- [Pinia](pinia.esm.dev/)
- Pinia - Hydrate:
  - https://pinia.vuejs.org/api/interfaces/pinia.DefineStoreOptionsInPlugin.html#hydrate
  - https://pinia.vuejs.org/cookbook/composables.html#ssr
  - https://pinia.vuejs.org/ssr/index.html#state-hydration
- [Vueuse](vueuse.org/)
- [Vueuse - useStorage](https://vueuse.org/core/usestorage/) (`useStorage` es prácticamente lo mismo que `useLocalStorage`, pero con el `localStorage` del navegador)

### Persistencia de estado en Nuxt

En Nuxt, podemos también tener el estado persistido tanto en el cliente como en el servidor. Esta sección, la voy a dejar aparte, a modo de anexo, porque es de nivel avanzado.

El problema con la implementación que habíamos hecho antes es que cuando seteamos el estado en el cliente, lo estamos haciendo en `localStorage`, y eso no es accesible desde el servidor, con lo que cuando la página se renderiza en el servidor, el estado está vacío. Si queremos que el estado persista en el servidor también, tenemos que hacerlo de otra manera.

> **Note**: Pequeña aclaración. Cuando hablamos de SSR o de renderizado en el servidor, nos referimos a que Nuxt se ejecuta en el servidor y genera el HTML que se va a enviar al cliente. En el lado del servidor se ejecuta Vue, Pinia y otras librarías en el contexto de Node.js. Nuxt realiza su ciclo de vida y termina mandando un HTML inicial que luego, en cliente, se va a "hidratar" con Vue nuevamente. O sea, que Vue coge ese HTML y lo sustituye el HTML que genera cuando Vue se ejecuta en el cliente. Con Nuxt, tenemos que tener en cuenta que muchos de nuestros archivos (componentes, páginas, composables, etc) se ejecutan en el servidor y en el cliente. Esto es lo que se conoce como **Universal**. Nuestro código será universal si puede ser ejecutable tanto en el servidor como en el cliente (tanto en Node.js como en el navegador).

La manera en la que comunmente se gestiona el estado en Nuxt 3, para estados poco complejos, es con `useState`. `useState` es un composable que viene con Nuxt 3 que viene siendo un reemplazo de `ref` pero que nos va a compartir el estado entre el cliente y el servidor.

- Docs: https://nuxt.com/docs/getting-started/state-management

Es una buena opción de gestión de estado, pero no nos sirve para nuestro ejemplo, en el cual necesitamos **persistencia** de estado, no **compartir** el estado del servidor al cliente.

`useState` nos podría servir para hacer una petición del lado del servidor y pasar la respuesta al lado del cliente, por ejemplo. O simplemente para usar un `ref` que pueda ejecutarse tanto en cliente como en servidor.

Lo que buscamos es una función que nos permita compartir el estado entre cliente y servidor, pero también que persista ese estado Que podamos cerrar la aplicación y al volver nos mantenga el valor. Y que eso ocurra tanto en el cliente como en el servidor.

Con Nuxt 3, viene otro composable que se llama [`useCookie`](https://nuxt.com/docs/api/composables/use-cookie) que nos permite guardar el estado en una cookie y es accesible desde el cliente y el servidor. El problema es que no podemos guardar muchos datos en una cookie. Las cookies tienen comunmente una capacidad máxima de 4KB aprox. Que nos da para guardar un estado pequeño, pero no para guardar un estado complejo, como el nuestro: un Array que puede contener potencialmente 100 objetos.

#### Peristiendo estado en el servidor con `useStorage`

Por eso, usaremos el composable de Nuxt `useStorage`. (En realidad, es una API de Nitro, como veremos más adelante)

Pero para utilizarlo, nos tenemos que meter en las entrañas de Nuxt, en el lado del servidor. Tenemos que crear una función que se ejecute en el servidor, que nos devuelva el estado persistido en el servidor y al que podamos acceder desde el cliente para también poder persistir el estado desde el cliente.

Necesitamos crear la carpeta `server` en la raíz del proyecto. Y dentro, otra carpeta llamada `api`.

Para una pequeña introducción a [la carpeta server](https://nuxt.com/docs/guide/directory-structure/server) de Nuxt 3, os recomiendo leeros la documentación oficial.

En la carpeta `api` vamos a crear un archivo llamado `cart.get.ts`. Este archivo va a ser un **endpoint** de nuestra aplicación. Es decir, una ruta que vamos a poder acceder desde el cliente y que va a devolver un JSON con el estado del carrito.

Los archivos que creamos en la carpeta `server/api` se van a convertir en endpoints de nuestra aplicación, de manera automática. Podemos acceder a ellos desde el cliente, por ejemplo, haciendo una petición `fetch` a la ruta `/api/cart`. Es recomendable que siempre se implementen exportando la funnción `defineEventHandler` para que nos de el tipado de manera automática.

```ts
// server/api/cart.get.ts
export default defineEventHandler((event) => {
  // ...
})
```

Dentro de nuestro endpoint, vamos a usar el composable [`useStorage` de Nitro](https://nitro.unjs.io/guide/introduction/storage), que es el "motor" de Nuxt 3.

Antes de implementar los endpoints, vamos a mover los tipos de `CartItemRecord` y `CartRecord` a nuestro archivo de tipos `types/index.ts` y los borramos de `composables/useCartStore.ts`.

```diff
// ...

+ export type CartItem = { quantity: number; data: Product }
+ export type CartItemRecord = Record<number, CartItem>
```

El `cart.get.ts` quedaría así:

```ts
import { CartItemRecord } from '~~/types'

export default defineEventHandler(async (event) => {
  let cart: CartItemRecord = await useStorage().getItem('db:cart')
  return cart
})
```

También vamos a implementar el `POST`: `server/api/cart.post.ts`. Este endpoint va a recibir un `JSON` con el estado del carrito y lo va a guardar.

```ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await useStorage().setItem('db:cart', body)

  return new Response('OK')
})
```

Si os fijáis, tanto en el `get` como en el `post`, estamos usando los métodos `getItem` y `setItem` del composable `useStorage` con la clave `db:cart`.

Esto es una convención de Nitro para decirle en qué lugar del servidor queremos guardar el estado. Podemos ver todos los "drivers" disponibles en: https://github.com/unjs/unstorage#drivers

Si no le pasáramos el prefijo `db:`, estaríamos guardando el estado en la memoria del servidor, que se perdería al reiniciar el servidor (o refrescar la página). Yo recomiendo usar el de `db`, para imitar el comportamiento que tendría una aplicación que guardara el estado en una base de datos. Pero en desarrollo, vamos a falsear el comportamiento de esa base de datos y vamos a configurar el `useStorage` para que guarde los datos en el disco duro, como archivos, usando el "File System" (`fs`).

En la configuración de Nuxt (`nuxt.config.ts`), podemos configurar Nitro:

```diff
  // https://nuxt.com/docs/api/configuration/nuxt-config
  export default defineNuxtConfig({
    css: ['~/assets/scss/main.scss'],
    modules: ['@pinia/nuxt'],
+   nitro: {
+     devStorage: {
+       db: {
+         driver: 'fs',
+         base: './.data/db',
+       },
+     },
+   },
  })
```

Tiene una opción de configuración llamada `devStorage` que nos permite configurar el `useStorage` para que use el "File System" en desarrollo. En producción, se usaría la base de datos que le configuráramos, aunque, de momento, nos saltaremos esa parte.

Lo siguiente que haremos será crear un composable para acceder a los endpoints del servidor. Lo llamaremos `useCartApi` y lo guardaremos en `composables/useCartApi.ts`.

```ts
import { CartItemRecord } from '~~/types'

export const useCartApi = () => {
  const getCart = async () => {
    const value = await $fetch('/api/cart')
    return value as CartItemRecord
  }

  const setCart = async (value: CartItemRecord) => {
    return $fetch<CartItemRecord>('/api/cart', {
      method: 'POST',
      body: JSON.stringify(value),
    })
  }

  return {
    getCart,
    setCart,
  }
}
```

Estamos usando `$fetch` para hacer las peticiones al endpoint `/api/cart`, el `GET` y el `POST`.

Ahora sólo nos queda juntarlo todo en el `useCartStore`. Pero esta vez vamos a refactorizarlo un poco para que utilice el la sintaxis de store de Pinia de función, en lugar de objeto. En la documentación de Pinia las llaman "setup store": https://pinia.vuejs.org/core-concepts/#setup-stores

Esta sería la nueva versión del `useCartStore`:

```ts
import { defineStore } from 'pinia'
import { CartItemRecord, Product } from '~~/types'

export const useCartStore = defineStore('cart', () => {
  const { getCart, setCart } = useCartApi()

  const items = ref<CartItemRecord>({})

  const totalItems = computed(() =>
    Object.values(items.value).reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  )

  const addItem = async (newItem: Product) => {
    const newCartItem = {
      quantity: items.value[newItem.id]?.quantity + 1 || 1,
      data: newItem,
    }

    if (items.value[newItem.id]) {
      items.value[newItem.id] = newCartItem
      await setCart(items.value)
    } else {
      await setCart({ [newItem.id]: newCartItem })
    }
  }

  useAsyncData('cart', async () => {
    items.value = await getCart()
  })

  return {
    items,
    addItem,
    totalItems,
  }
})
```

Como veis, seguimos usando `defineStore` de Pinia. Pero en lugar de pasarle un objeto, le pasamos una función que devuelve un objeto. En esta función, podemos usar las funciones de reactividad de Vue que queramos, como `ref`, y los composables de Nuxt que queramos, como el `useAsyncData`, que usamos al final.

Importamos el `const { getCart, setCart } = useCartApi()` para poder usar los métodos que hemos creado en el composable `useCartApi`.

Los cambios más grandes están en el método `addItem`. Ahora, en lugar de modificar el estado del carrito sólamente, lo que hacemos es llamar a `setCart` para guardar el nuevo estado en el servidor.

Y también hemos añadido el `useAsyncData` para que llame a la API cuando Nuxt se ejecuta en el lado del servidor y nos devuelva los datos antes de que se renderice la página. Esta parte es muy importante, ya que no queremos que en el carrito primero se pinte un `0` y luego se actualice con los datos de la API cuando JS termina de ejecutarse en cliente.

De esta manera, hemos conseguido que el carrito se guarde en el servidor y que se pueda compartir entre servidor y el navegador.
