# ecommerce-app

Resultado de la primera sesión del módulo.

<img src="./screenshot.png" width="800">

## Inicio

```
vue create <name>
# Con el siguiente preset: (opcional, pero recomendado para el máster)
# [Vue 3] dart-sass, babel, typescript, router, vuex, eslint, unit-jest
# A continuación, seguir los pasos descritos en la consola.
# Iniciaremos nuestra app en el entorno de desarrollo con el
# comando: (definido en el package.json)
npm run serve
```

### Eliminar los archivos que vienen con la app que no vamos a usar

1. Borramos los archivos innecesarios:

- `/test`
- `/src/assets/logo.png`
- `/src/components/HelloWorld.vue`
- `/src/views/About.vue`

2. En la página home

- Eliminamos las referencias a los componentes e imágenes borrados.

```diff
<template>
  <div class="home">
-    <img alt="Vue logo" src="../assets/logo.png" />
-    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
-import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
export default defineComponent({
  name: 'Home',
  components: {
-    HelloWorld,
  },
})
</script>
```

3. En el `src/router/index.ts`

- Borramos la referencia a la página de `About.vue`

```diff
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
-  {
-    path: '/about',
-    name: 'About',
-    // route level code-splitting
-    // this generates a separate chunk (about.[hash].js) for this route
-    // which is lazy-loaded when the route is visited.
-    component: () =>
-      import(/* webpackChunkName: "about" */ '../views/About.vue'),
-  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
export default router
```

4. Y por último, en `src/App.vue`

- Eliminamos todos los enlaces (el elemento `nav`)
- Y los algunos estilos generales (al gusto)

```diff
<template>
-  <div id="nav">
-    <router-link to="/">Home</router-link> |
-    <router-link to="/about">About</router-link>
-  </div>
  <router-view />
</template>
-
-<style lang="scss">
- #app {
-   font-family: Avenir, Helvetica, Arial, sans-serif;
-   -webkit-font-smoothing: antialiased;
-   -moz-osx-font-smoothing: grayscale;
-  text-align: center;
-  color: #2c3e50;
-}
-
-#nav {
-  padding: 30px;
-
-  a {
-    font-weight: bold;
-    color: #2c3e50;
-
-    &.router-link-exact-active {
-      color: #42b983;
-    }
-  }
-}
-</style>
```

- Nos quedaría solamente el `<router-view />`, que es el "placeholder" donde se va a renderizar nuestra ruta:

```vue
<template>
  <router-view />
</template>
```

En esta vista podemos añadir cosas que queramos que estén para la aplicación de manera global. Como un `header` (como veremos a continuación), o el aviso de cookies...

### Componentes propios

Vamos a crear nuestro primer componente.

Creamos el archivo `src/components/Header.vue`. Aquí es donde vienen muy bien los _snippets_ de código. Voy a compartiros el que tengo para los componentes de Vue 3 + TS:

Son accesibles en VS Code con el comando "Ctrl/Cmd + Shift + P" > "Configure User Snippets"

```json
// vue.json snippets
{
  // Place your snippets for vue here. Each snippet is defined under a snippet name and has a prefix, body and
  // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
  // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the
  // same ids are connected.
  "Vue TS simple boilerpalte": {
    "prefix": "vuets",
    "body": [
      "<template>",
      "  ",
      "</template>",
      "",
      "<script lang=\"ts\">",
      "import { defineComponent } from 'vue'",
      "",
      "export default defineComponent({${0}})",
      "</script>",
      "",
      "<style></style>",
      ""
    ],
    "description": "Vue TS simple boilerpalte"
  }
}
```

Podéis generar vuestros propios _snippets_ para TS, JS, vue, etc... Gracias a la app https://snippet-generator.app/ es muy sencillo (disponibles otros editores). Tomad el ejemplo de arriba como ejemplo para vuestros _snippets_. En este caso, con teclear `vuets` en el archivo vacío, ya nos mostraría un autocompletado para generar esa "plantilla" de código.

Este paso es opcional, pero altamente recomendado, sin importar el framework o lenguaje utilizado. Incluso, en empresas, si se comparte un mismo estilo de código, se puede tener un archivo de _snippets_ compartidos para los equipos/squads pertinentes.

De vuelta, a `src/components/Header.vue`, vamos a poner algo simple solo para verlo en pantalla:

```vue
<template>
  <nav class="nav">
    <div>Logo</div>
    <div>Cart</div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>

<style lang="scss" scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
</style>
```

Fijaros en los atributos de los elementos `script` y `style`. Vamos a hacer uso de TS y SCSS en este caso.

En `src/App.vue`, añadiremos una referencia a nuestro nuevo componente:

```diff
<template>
+ <Header />
  <router-view />
</template>
+
+ <script lang="ts">
+ import { defineComponent } from 'vue'
+ import Header from '@/components/Header.vue'
+ export default defineComponent({
+  components: {
+    Header,
+  },
})
+ </script>
```

El componente no queda ocupando el 100% de la pantalla y es porque no tenemos unos estilos de "reset" que normalmente se añaden al principio de los proyectos.

Para esta app no vamos a usar ninguna librería de estilos, como las implementaciones de Material Design (como Vuetify, en el caso de Vue) o Tailwind. Usaremos estilos propios, pero sin reparar mucho en ellos.

Vamos a añadir, de hecho, directamente el contenido de: https://github.com/Lemoncode/master-frontend-lemoncode/blob/a40dd58/04-frameworks/03-vue/05_ecommerce_app_final/src/assets/scss/main.scss (o su última versión en master) en `src/assets/scss/main.scss`

Y vamos a importarlo en nuestro archivo de entrada: `src/main.ts`

```diff
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
+
+import './assets/scss/main.scss'
createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
```

Vemos que es un poco diferente a lo que hemos usado en los ejemplos de la teoría (y los ejemplos de sintaxis que aparecen en la documentación).

¿Cómo funciona esto? Si os fijáis, fuera de `/src`, tenemos un directorio que es `/public` y, dentro, un `/public/index.html`. En el caso de Vue CLI, la herramienta escuchará cambios en nuestros archivos cuando tengamos el servidor local ejecutándose (con `npm run serve`) y donde vemos el comentario de:

```html
<!-- built files will be auto injected -->
```

Se "inyectarán" nuestros archivos: el código generado tras compilar `main.ts`.

Para la versión de producción, ved los comandos de vue-cli en su [documentación oficial](https://cli.vuejs.org/guide/build-targets.html). Es muy interesante que viene con opciones por defecto para "librerías de Vue". O nos permite compilar la aplicación de Vue como un Web Component, si lo deseamos.

Volvemos al componente Header para añadir solo unas clases más, para darle mejor apariencia:

```diff
<template>
-  <nav class="nav">
+  <nav class="nav flex align-items-center justify-content-between container">
    <div>Logo</div>
    <div>Cart</div>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
<style lang="scss" scoped>
.nav {
  min-height: 80px;
  background-color: rgb(198, 247, 244);
  position: sticky;
  top: 0;
}
</style>
```

En el resto de la sesión, no repararemos mucho en los estilos. Pero utilizaremos algunas de las clases que vienen en ese archivo de estilos globales.

#### Product List

Vamos a empezar a pintar productos en nuestra app de Ecommerce. Para ello, usaremos datos "mockeados" desde el componente. Empezamos creando un componente `src/components/ProductList.vue`. Podemos usar nuestro _snippet_ para iniciar el componente con algo ya:

```vue
<template> </template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
<style></style>
```

Añadimos una lista y la directiva de loops de vue:

```diff
<template>
+  <ul>
+    <li v-for="product in list" :key="product.id"></li>
+  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({})
</script>
<style></style>
```

Como véis, estoy esperando una propiedad (Array) `list` y que tenga objetos que contengan, al menos, una propiedad `id`.

Vamos a utilizar un JSON de datos para nuestro componente. Dónde lo podemos guardar? Podríamos poner el JSON, como objeto de JS directamente en el componente, pero vamos a imitar el comportamiento de una app de verdad, haciendo un "servicio", como habéis visto en otros frameworks como Angular.

Añadiremos el archivo `src/services/products.ts` y de momento vamos a añadir el JSON en `src/services/books.mock.json`

Nuestro servicio, de momento va a importar el archivo JSON y a devolverlo como si fuera un servicio que se conecta a un servidor... En este primer ejemplo, vamos a usar _dynamic imports_. De esta manera, generaremos un chuck separado en nuestra aplicación y no se incluirá este archivo en el _bundle_ principal.

Así es como se haría:

```ts
export const productService = {
  async get() {
    const books = await import(
      /* webpackChunkName: "books" */ './books.mock.json'
    ).then(m => m.default)
    return books
  },
}
```

Pero si nos damos cuenta, falta el tipado! Vamos a añadir nuestros tipos globales de la app:

```ts
// /src/types/index.ts
type Price = string
type ProductId = string
export interface Product {
  id: ProductId
  author: string
  published: string
  title: string
  category: string
  publisher: string
  price: Price
}
```

Usamos la misma "forma" que tienen los objetos del JSON y lo `export`amos para importarlo en nuestros módulos de TS.

Nuestro servicio quedaría entonces así:

```diff
+import { Product } from '@/types'
+
export const productService = {
-  async get() {
+  async get(): Promise<Product[]> {
    const books = await import(
      /* webpackChunkName: "books" */ './books.mock.json'
    ).then(m => m.default)
    return books
  },
}
```

Necesitamos añadir el archivo `./books.mock.json` (podéis descargarlo de [aquí](https://raw.githubusercontent.com/Lemoncode/master-frontend-lemoncode/a40dd58/04-frameworks/03-vue/05_ecommerce_app_final/public/books.mock.json)) en la misma carpeta, ya que el `import()` está cogiendo un recurso con un "path" relativo y le estamos indicando (porque la ruta empieza con `./`) que es en la misma carpeta donde está este `productService`.

Antes de continuar, necesitamos decirle a TS que puede importar los archivos de JSON como si fueran JS:

En el `tsconfig.json`, tenemos que añadir, dentro de `compilerOptions`:

```diff
+  "resolveJsonModule": true,
```

De esta manera, `import`ará archivos JSON como si fueran módulos de ESM.


Vamos a añadir el servicio en el componente de _ProductList_:

```diff
<template>
  <ul>
    <li v-for="product in list" :key="product.id"></li>
  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
+import { productService } from '@/services/product.ts'
+import { Product } from '@/types'
export default defineComponent({
+  data() {
+    return {
+      list: [] as Product[],
+    }
+  },
+  async created() {
+    this.list = await productService.get()
+  },
})
</script>
<style></style>
```

**Nota**: Importante añadir el `as Product[]` en el dato `list`, para que TS no de errores.

Como veís, hemos añadido el tipado en nuestra propiedad `list` del estado local del componente. Ahora tenemos que pintar algo dentro de los `li`s.

```diff
<template>
  <ul>
-    <li v-for="product in list" :key="product.id"></li>
+    <li v-for="product in list" :key="product.id">
+      {{ product.title }}
+    </li>
  </ul>
</template>
```

Con ese cambio deberíamos ver ya una lista de _lorem ipsums_ en la pantalla. Vamos a pintar el resto de datos:

```diff
<template>
  <ul>
    <li v-for="product in list" :key="product.id">
-      {{ product.title }}
+      <h2>
+        {{ product.title }}
+      </h2>
+      <p>
+        <span class="grey-text">Author: </span>
+        <strong>{{ product.author }}</strong>
+      </p>
+      <p>
+        <span class="grey-text">Publisher: </span>
+        {{ product.publisher }}
+      </p>
+      <p>
+        <span class="grey-text">Year: </span>{{ product.published }}
+      </p>
    </li>
  </ul>
</template>
```

Para darle un aspecto más real, añadiremos una imagen y un poco más de estructura: haremos un grid con 3 columnas:

```diff
<template>
-  <ul>
+  <ul class="product-list">
    <li v-for="product in list" :key="product.id">
       <!-- Añadimos una capa de contenedor y unas clases -->
+      <article class="grid product-container card">
+        <div class="image">
+          <img :src="`https://picsum.photos/id/${product.id}/200`" alt="" />
+        </div>
+        <div class="product-container__content">
...          <!-- Aquí los datos que acabábamos de añadir -->
+        </div>
+        <div class="flex product-container__aside">
+          <div class="text-align-end aside__price">
+            {{ product.price }}
+          </div>
+        </div>
+      </article>
    </li>
  </ul>
</template>
```

Y en el mismo archivo `.vue`, unos estilos:

```vue
<style lang="scss" scoped>
.product-list {
  padding: 0;
  li {
    margin-bottom: 2em;
  }
}
.product-container {
  align-items: flex-start;
  grid-template-columns: 210px 1fr 100px;
}
</style>
```

#### Siguientes pasos:

- [ ] Añadir computed property `totalProducts`
- [ ] Binding de clases de manera dinámica: `product.discount !== '0.0',`
- [ ] Añadir un botón de compra como componente, `AddToCartButton`
- [ ] Añadir la página detalle
- [ ] cambiar dynamic import a fetch de /public, luego a fetch de [raw.githubusercontent.com](https://github.com/Lemoncode/master-frontend-lemoncode/blob/a40dd5852e7f199b7ca90a207177fdcc59c70dcf/04-frameworks/03-vue/05_ecommerce_app_final/public/books.mock.json).
- [ ] Comprobar cómo se carga el JSON desde la ventana de Red de las DevTools del navegador.
