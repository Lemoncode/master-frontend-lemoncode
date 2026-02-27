
---
layout: custom-cover
background: vue-sticker.jpg
---

# <logos-nuxt-icon /> Nuxt - I

## 🌈 Vuenas tardes!!! 🌈


---
layout: statement
title: Nuxt
---

# <logos-nuxt-icon /> Nuxt

---
layout: two-cols
title: Nuxt - Características principales
---

<style>
ul li {
  font-size: .9rem;
}
</style>

<v-clicks depth="2">

  - **Zero-config**: Configuración mínima para empezar
  - **File-based routes**: Rutas dinámicas y anidadas
  - **Data fetching** (_opinionando_)
  - **Backend** (APIs) integrado (con Nitro)
  - **Middleware** (https://nuxt.com/docs/4.x/directory-structure/app/middleware)
  - Transiciones: animaciones entre páginas
  - **SEO** (Search Engine Optimization)
  - **Optimización de _assets_** integrada
  - **Error-handling**
  - **Layouts**
  - **Diferentes modos de renderizado**:
    - Server Side Rendering (SSR)
    - Generación de sitios estáticos (SSG, JAMStack)
    - Single Page Application (SPA)
    - Modos Híbridos (SSR + SPA)
    - Islas (Componentes que se renderizan en el servidor y no son interactivos)

</v-clicks>

::right::

<v-clicks depth="3">

  - **Vite** (servidor de desarrollo y bundler)
    - Code-splitting
    - Hot Module Reloading (HMR)
    - OXC-compatible (https://es.vite.dev/guide/rolldown)
  - **Type-safe**: TypeScript
    - Typechecking/Build
    - Auto generated types
      - [Auto Imports](https://nuxt.com/docs/4.x/guide/concepts/auto-imports)
      - [API route types](https://nuxt.com/docs/4.x/guide/concepts/server-engine#typed-api-routes)
  - **Ecosistema de módulos** (https://nuxt.com/modules)
  - Y otras características de Nuxt:
    - **Hooks**
    - **Components/Composables**
    - **Plugins**
    - **Runtime config**
    - **Layers**
    - **DevTools**

</v-clicks>


---
layout: quote
---

# Progressive Enhacement

No necesitamos todas las funcionalidades de Nuxt. Podemos usar solo lo que necesitamos y el bundle final será más pequeño.

---
layout: two-cols
title: Progressive Enhacement
---

<style>
img.max-h-xs {
  max-height: none;
}
</style>


## Estructura de carpetas inicial

<br />

<img src="/nuxt-inicio.png" class="max-h-xs" />


::right::

<v-click>

## Ejemplo de app compleja

<br />

<img src="/nuxt-completo.png" class="max-h-xs" />
</v-click>

---
layout: quote
---

# Universal rendering (SSR)


---
layout: full
title: Universal rendering
---

# Universal rendering (SSR)
<div class="flex justify-center relative">
  <img src="/ssr.svg" />
  <!-- Server -->
  <logos-nodejs-icon class="absolute top-1/2 left-0 text-6xl" v-click="1" />
  <ri-arrow-right-line class="absolute top-1/2 left-[70px] text-6xl" />
  <p class="absolute top-[calc(50%+.3rem)] left-[140px] text-xl">Document (sin JS)</p>
  <!-- Loading -->
  <ri-arrow-right-line class="absolute top-[calc(50%+1rem)] left-[310px] text-3xl" v-click="1" />
  <p class="absolute top-[calc(50%+.3rem)] left-[350px] text-2xl" v-click="1">Naveador carga<br />todo el HTML<br /> y ejecuta el JS</p>
  <!-- Hidratación -->
  <ri-arrow-right-line class="absolute top-[calc(50%+1rem)] left-[515px] text-3xl" v-click="2" />
  <img src="/js-logo.png" class="absolute top-1/3 right-0 max-w-[140px] h-auto" v-click="2" />
</div>


---
layout: quote
---

# File-based routes

---
layout: full
title: File-based routes
---

# Rutas dinámicas y anidadas

```md
-| pages/
---| index.vue                    # Página Home (URL: /)
---| [category]/                  # Nombre de parámetro dinámico (ejemplo: "/venta-de-coches")
-----| [slug].vue                 # Página para ruta dinámica (ejemplo: "/venta-de-coches/ford-mustang-cabriolet")
```
<br/>

## Ejemplo de página

```vue
<template>
  <h1>{{ product.name }}</h1>
</template>

<script setup lang="ts">
const { slug, category } = useRoute().params

const { data: product } = useAsyncData(`product-${slug}`, () => $fetch(`/api/products/${slug}`))

const { data: links } = useAsyncData(`links-${category}`, () => $fetch(`/api/categories/${category}/links`))
```

<v-clicks depth="2">

- File-based routes: Rutas dinámicas y anidadas
- `useRoute()` para obtener la ruta actual (y sus parámetros)
- `useAsyncData()` para hacer peticiones HTTP

</v-clicks>

---
layout: quote
---

# Data fetching

---
layout: two-cols
title: Data fetching (I)
---

<v-clicks depth="2">

- <span v-mark="{ at: 1, type:'underline', color: '#008f53' }">`useFetch()`</span>
  - composable para hacer peticiones HTTP a una URL de manera SSR-friendly.
  - Es un wrapper de `$fetch` (`ofetch` en Nuxt).
- <span v-mark="{ at: 4, type:'underline', color: '#008f53' }">`useAsyncData()`</span>
  - similar a `useFetch()`: composable asíncrona para hacer peticiones HTTP.
  - Nos da acceso a datos cacheados.
  - Permite hacer múltiples peticiones HTTP en paralelo.
  - Tiene otras funcionalidades como:
    - Manipulación de los datos de la respuesta.
    - Refetching manual o automático (watcher).
    - Error handling
    - etc.

</v-clicks>

::right::

<v-clicks depth="2">

- <span v-mark="{ at: 9, type:'underline', color: '#008f53' }">`$fetch`</span>
  - Función para hacer peticiones HTTP a una URL.
  - Basado en [`ofetch`](https://github.com/unjs/ofetch)
    - Engine-agnostic fetch API.
    - Parseado de respuestas automático (JSON, text, etc.).
    - JSON en el body de la petición.
    - etc.
  - Integrado con las rutas de Nuxt.

</v-clicks>

---
layout: full
title: Data fetching (II)
---

## `useFetch()` / `useAsyncData()` + `$fetch()`

```vue
<script setup lang="ts">
// ❌ Se ejecuta dos veces: una en el servidor y otra en el cliente.
const dataTwice = await $fetch('/api/item')

// ✅ Se ejecuta una vez en el servidor y se transfiere al cliente como "payload".
const { data } = await useAsyncData('item', () => $fetch('/api/item'))

// ✅ Se puede usar `useFetch()` como alias de `useAsyncData()` + `$fetch()`
const { data } = await useFetch('/api/item')

</script>
```

---
layout: quote
---

# Nuxt en práctica (mini‑app + recetas)

---
layout: full
title: Estructura mínima (para trabajar cómodo)
---

# Estructura mínima de Nuxt

```md
-| app.vue
-| pages/
---| index.vue
---| products/
-----| [id].vue
-| components/
---| AppHeader.vue
-| layouts/
---| default.vue
-| composables/
---| useCart.ts
```

### Otras carpetas

```md
-| middleware/
----| auth.ts
-| server/
----| api/
------| products.get.ts
------| products/[id].get.ts
```

<v-clicks depth="2">

- **Idea clave**: Nuxt conecta "carpetas" con "comportamiento" (rutas, API, middleware, plugins).
- <strong v-mark="{ at:2, type:'highlight', color: '#008f53' }">🚀 Mini-reto</strong>: crea estas carpetas y deja archivos vacíos → observa cómo Nuxt "entiende" el proyecto.

</v-clicks>

---
layout: two-cols
title: App shell (app.vue)
---

## `app.vue` = el "wrapper" global

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

<v-clicks depth="2">

- **`NuxtLayout`**: aplica el layout actual.
- **`NuxtPage`**: renderiza la página según la ruta.

</v-clicks>

::right::

<v-clicks depth="2">

<h2 v-mark="{ at: 3,type:'highlight', color: '#008f53' }">🚀 Mini-reto</h2>

- Crea `layouts/default.vue` con un header.
- Crea `components/AppHeader.vue` y úsalo en el layout.

</v-clicks>

---
layout: full
title: Layouts (sin duplicar UI)
---

# Layouts: estructura reutilizable (normalmente `header`/`footer`)

```vue
<!-- layouts/default.vue -->
<template>
  <AppHeader />
  <main class="container mx-auto p-6">
    <slot />
  </main>
  <AppFooter />
</template>
```

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="grid grid-cols-[220px_1fr] min-h-screen">
    <aside class="p-4 border-r">Admin</aside>
    <main class="p-6"><slot /></main>
  </div>

</template>
```

<!-- - **Siguiente Práctica**: cambiar el "layout" en una página sin tocar los componentes en el archivo de la página. -->


---
layout: two-cols
title: Metadatos por página
---

## `definePageMeta()`

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})
</script>
```

<v-clicks depth="2">

- Elige layout por página.
- Activa middleware por página.

</v-clicks>

::right::

<v-clicks depth="2">

<h2 v-mark="{ at: 3, type:'highlight', color: '#008f53' }">🚀 Mini-reto</h2>

- Crea `pages/admin.vue`.
- Ponle `layout: 'admin'`.
- Comprueba el cambio visual.

</v-clicks>

---
layout: two-cols
title: Navegación
---

## Navegación con `NuxtLink`

```vue
<template>
  <NuxtLink to="/">Home</NuxtLink>
  <NuxtLink :to="{ name: 'products-id', params: { id: 1 } }">
    Producto 1
  </NuxtLink>
</template>
```

::right::

## Navegación programática

```ts
const router = useRouter()
await router.push('/products/1')
```

---
layout: two-cols
title: Estado global sin librerías
---

## Estado compartido con `useState()`

```ts
// composables/useCart.ts
export const useCart = () => {
  const items = useState<number[]>('cart-items', () => [])

  const add = (id: number) => items.value.push(id)
  const remove = (id: number) =>
    (items.value = items.value.filter(x => x !== id))

  return { items, add, remove }
}
```

<v-clicks depth="2">

- **SSR-friendly**: Nuxt serializa el estado necesario.
- **Clave**: la key (`'cart-items'`) identifica el estado global.

</v-clicks>

::right::

<v-clicks depth="2">

<h2 v-mark="{ type:'highlight', color: '#008f53' }">🚀 Mini-reto</h2>

- En `AppHeader`, muestra `items.value.length`.
- En `pages/products/[id].vue`, añade un botón "Añadir al carrito".

</v-clicks>

---
layout: full
title: Middleware (protección de rutas)
---

# Middleware: protege rutas en 10 líneas

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const isLoggedIn = useState<boolean>('auth', () => false)

  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }
})
```

<v-clicks depth="2">

- **Uso típico**: dashboard/admin, checkout, rutas privadas.
- <strong v-mark="{ at: 2, type:'highlight', color: '#008f53' }">🚀 Mini-reto</strong>: crea `pages/login.vue` y un botón "Entrar" que ponga `auth=true`.

</v-clicks>

---
layout: two-cols
title: Backend integrado (Nitro)
---

## API en `server/api/*`

```ts
// server/api/products.get.ts
export default defineEventHandler(() => {
  return [
    { id: 1, name: 'Limonada clásica' },
    { id: 2, name: 'Limonada con menta' },
  ]
})
```

::right::

## Consumir desde una página

```ts
const { data: products } = await useFetch('/api/products')
```

---
layout: full
title: "Tip: API dinámica + 404"
---

# API dinámica + 404 con `createError()`

```ts
// server/api/products/[id].get.ts
export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = { id, name: `Producto ${id}` }

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  // Ejemplo: si no existe...
  if (id > 99) {
    throw createError({ statusCode: 404, statusMessage: 'No encontrado' })
  }

  return product
})
```

---
layout: two-cols
title: Runtime config (público vs privado)
---

## "Runtime Config" en `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // solo server
    public: {
      apiBase: '/api',
    },
  },
})
```

::right::

## Leer config

```ts
const config = useRuntimeConfig()
const base = config.public.apiBase
```

---
layout: full
title: SEO por página (sin magia)
---

# SEO práctico: `useSeoMeta()`

```ts
useSeoMeta({
  title: 'Producto | Nuxt Shop',
  description: 'Detalle del producto',
  ogTitle: 'Producto | Nuxt Shop',
  ogDescription: 'Detalle del producto',
})
```

<v-clicks depth="2">

- <strong v-mark="{ at: 1, type:'highlight', color: '#008f53' }">🚀 Mini-reto</strong>: ponlo en `pages/products/[id].vue` y cambia el title según el producto.

</v-clicks>

---
layout: two-cols
title: Plugins (una "capa" para tu app)
---

## Plugin: expón un cliente `$api`

```ts
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = $fetch.create({ baseURL: '/api' })
  return { provide: { api } }
})
```

::right::

## Uso en componentes/pages

```ts
const { $api } = useNuxtApp()
const product = await $api(`/products/1`)
```

<v-clicks depth="2">

- `useNuxtApp()` para obtener el contexto de la aplicación (plugins, vue app, ssr context, etc.).

</v-clicks>


---
layout: full
title: Composables
---

# Composables de Nuxt

<v-clicks>

- `useFetch()`
- `useAsyncData()`
- `useState()`
- `useRouter()`
- `useRoute()`
- `useSeoMeta()`
- `useRuntimeConfig()`
- `useNuxtApp()`

</v-clicks>



---
layout: quote
---

# Checklist de Nuxt para proyectos reales

<v-clicks depth="2">

- Layouts + navegación (`NuxtLayout`, `NuxtLink`)
- Estado global con `useState` (si hace falta, luego Pinia)
- Middleware para proteger rutas
- API con Nitro (`server/api/*`) + errores con `createError`
- `runtimeConfig` para variables de entorno
- SEO por página con `useSeoMeta`
- Caché de datos con `useAsyncData()` y cache keys dinámicas

</v-clicks>

---
layout: full
title: Overview del mini-proyecto
---

# Overview del mini‑proyecto (lo que montamos con los mini‑retos)

<v-clicks depth="2">

- **Objetivo**: una mini‑app e-commerce con rutas, SSR/data, estado global, backend integrado y páginas protegidas.
- **Piezas que construimos**:
  - `app.vue` → `NuxtLayout` + `NuxtPage`
  - `layouts/default.vue` → wrapper público (header/footer)
  - `layouts/admin.vue` + `pages/admin.vue` → wrapper admin (sidebar)
  - `middleware/auth.ts` + `pages/login.vue` → protección de rutas + login fake con `useState('auth')`
  - `composables/useCart.ts` + `AppHeader` → carrito global con `useState('cart-items')`
  - `server/api/products*.ts` → API con Nitro + errores 400/404 con `createError`
  - `useFetch`/`useAsyncData` → consumo SSR-friendly + cache keys
  - `useRuntimeConfig` → config por entorno (public/private)
  - `useSeoMeta` → title/description por página
  - `plugins/api.ts` + `useNuxtApp()` → cliente `$api` centralizado (opcional)

</v-clicks>

