# ecommerce-app

## Refactor

Vamos a hacer un pequeño refactor de nuestra app y, por el camino, vamos a repasar los conceptos que vimos en las sesiones 1 y 2:

- Binding de atributos
- Componentes propios
- Comunicación entre componentes:
  - Props
  - Custom Events

### Separar componente hijo

Os decía que el componente de `components/ProductList.vue` estaba quedando un poco grande. Vamos a extraer cada uno de los items de la lista a un componente. Mi consejo es hacer este tipo de refactor sólo cuando sea necesario, para evitar sobre-ingeniería y optimización prematura.

En nuestro `ProductList`, vamos a extraer lo que va dentro de los cada `NuxtLink` en los `li`, la etiqueta `article`:

```html
<article
  class="grid product-container card"
  :class="{
    'product-container--has-discount':
      product.discountPercentage > 15,
  }"
>
  <div class="image">
    <img :src="product.images[0]" alt="" loading="lazy" />
  </div>
  <div class="product-container__content">
    <h2>{{ product.title }}</h2>
    <p>
      <span class="grey-text">Description: </span>
      <strong>{{ product.description }}</strong>
    </p>
    <p>
      <span class="grey-text">Brand: </span>
      {{ product.brand }}
    </p>
    <p><span class="grey-text">Category: </span>{{ product.category }}</p>
  </div>
  <div class="flex product-container__aside">
    <div class="text-align-end aside__price">
      <StaticPrice :quantity="product.price" />
    </div>
    <AddToCartButton :product="product" @addItem="onAddItem" />
  </div>
</article>
```

Creamos el componente `ProductListItem.vue` y en el template, vamos a "pegar" ese markup:

```vue
<template>
  <!-- Aquí -->
</template>
```

Inmediatamente, veremos como todas las referencias a `product` se marcan en rojo, ya que el componente no tiene esa información todavía. Se la tenemos que pasar con una `prop`:

```vue
<script setup lang="ts">
import type { Product } from '~~/types'

const props = defineProps<{
  product: Product
}>()
</script>
```

Añadimos también el `import` de los tipos.

Y por último, para que no nos de más errores la plantilla, tenemos que definir el método `onAddItem`. Así que vamos a "cortar y pegar" esa lógica del `ProductList` al `ProductListItem`:

En el `ProductList`:

```diff
- // Cart
- const { addToCart } = useCartStore()
-
- const onAddItem = (product: Product) => {
-   addToCart(product)
- }
```

En `ProductListItem`:

```diff
+ // Cart
+ const { addToCart } = useCartStore()
+
+ const onAddItem = (product: Product) => {
+   addToCart(product)
+ }
```

Ahora, ya estamos list@s para sustituir en `ProductList`, la sección del markup del `<article></article>` por nuestro nuevo componente `<ProductListItem />`:

```diff
<template>
  <section class="wrapper">
    <div class="flex align-items-center justify-content-between">
      <h1>Products</h1>
      total: {{ totalProducts }}
    </div>

    <hr />
    <input type="text" v-model="textFilter" />
    <hr />

    <ul class="product-list">
      <li v-for="product in filteredList" :key="product.id">
        <NuxtLink :to="`/product/${product.id}`">
-          <article
-            class="grid product-container card"
-            :class="{
-              'product-container--has-discount':
-                product.discountPercentage > 15,
-            }"
-          >
-            <div class="image">
-              <img :src="product.images[0]" alt="" loading="lazy" />
-            </div>
-            <div class="product-container__content">
-              <h2>
-                {{ product.title }}
-              </h2>
-              <p>
-                <span class="grey-text">Description: </span>
-                <strong>{{ product.description }}</strong>
-              </p>
-              <p>
-                <span class="grey-text">Brand: </span>
-                {{ product.brand }}
-              </p>
-              <p>
-                <span class="grey-text">Category: </span>{{ product.category }}
-              </p>
-            </div>
-            <div class="flex product-container__aside">
-              <div class="text-align-end aside__price">
-                <StaticPrice :quantity="product.price" />
-              </div>
-              <AddToCartButton :product="product" @addItem="onAddItem">
-                Add to cart
-              </AddToCartButton>
-            </div>
-          </article>
+          <ProductListItem :product="product" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
```

De esta manera, nos queda mucho más pequeña la plantilla. Y hemos eliminado del `ProductList` la lógica que tenía que ver con el carrito. Nos ayudará a que el mantenimiento del código sea más sencillo, ya que no estamos mezclando _concerns_ y los archivos son más pequeños (en _LoC_).

Ahora el ProductListItem tiene 1 responsabilidad, que es pintar cada uno de los productos de la lista.

Vamos a ver qué tiene el ProductList: Tiene la lógica de la lista, y también de filtrado de la lista.

Por último, migraremos los estilos que pertenecen al componente hijo. Las reglas de CSS con los selectores:

- `.product-container`
- `.product-container__content`
- `.product-container__aside`
- `.image`
- `.product-container--has-discount`

```diff
+ <style lang="scss" scoped>
+ .product-container {
+   align-items: flex-start;
+   grid-template-columns: 210px 1fr 100px;
+ }
+
+ .product-container__content {
+   padding: 0 1em;
+ }
+
+ .product-container__aside {
+   flex-direction: column;
+   justify-content: space-between;
+   height: 100%;
+ }
+ .image {
+   display: flex;
+   height: 100%;
+   flex-direction: column;
+   justify-content: center;
+   img {
+     width: 100%;
+     aspect-ratio: 1/1;
+     object-fit: cover;
+   }
+ }
+ .product-container--has-discount {
+   background-color: rgba(yellow, 0.5);
+ }
+ </style>
```

Ahora debería estar completamente migrado un verse como antes.

Vamos a arreglar un par de cosas que no quedaron del todo bien. Normalmente, en una revisión de código no pasarían desapercibidas.

### Evitar lógica en las plantillas

En el ProductListItem, estábamos dando un color diferente a los que tenían un descuanto. Con `:class`:

```tsx
  :class="{
    'product-container--has-discount': product.discountPercentage > 15,
  }"
```

Recordamos, que lo que hace esta sintaxis de clases dinámicas es aplicar a ese elemento de HTML la clase `product-container--has-discount` sólo cuando la condición que la acompaña se cumple.

Pero quedaría más limpio si sacamos el `product.discountPercentage > 15` de la plantilla y lo definimos en el `script` del componente.

En general, se recomienda intentar no poner nada de lógica de JavaScript en la plantilla.

Utilizaremos el meetodo `computed` para definir esta constante reactiva.

```ts
const hasDiscount = computed(() => product.discountPercentage > 15)
```

- Debatir si pasar el `discount` como prop o si debería ser una _computed property_.

## ToDo

- Mover filtrado a composable con Pinia para que persista entre navegaciones
- Usar composición de composables para usar `localStorage` y persistir el valor entre sesiones.
