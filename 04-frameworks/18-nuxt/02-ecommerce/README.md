# 🍋 De la mini‑app a la tienda completa — Guía paso a paso (Nuxt 4)

Esta guía explica **cómo evolucionar esta app** (la que montamos en la **primera hora**)
hasta convertirla en la tienda de referencia que hay en [`../ecommerce`](../ecommerce)
(el resultado de la **segunda hora**).

- La **prosa** está en español (es material de clase).
- El **código** está en inglés, igual que en el proyecto final.
- Cada paso explica **qué es** la funcionalidad, **por qué** la usamos y muestra un
  **diff** con los cambios exactos.

> Convención de los diff: las líneas con `-` se **quitan**, las líneas con `+` se
> **añaden**. Los archivos nuevos se muestran enteros como `+`.

---

## 🎯 Objetivo de la hora 2

Partimos de una mini‑app que ya tiene:

- `app.vue` con `NuxtLayout` + `NuxtPage`
- `layouts/default.vue` (público) y `layouts/admin.vue` (placeholder)
- `pages/index.vue`, `pages/products/[id].vue`, `pages/login.vue`, `pages/admin.vue`
- `composables/useCart.ts` (carrito simple)
- `middleware/auth.ts` (protección básica)
- `data/products.ts` → los productos **a fuego** en el front (todavía sin backend)

Y llegamos a una tienda con:

1. **Backend real con Nitro** (`server/api/*`): movemos los datos del front al servidor.
2. **Carrito con cantidades** (`CartItem`).
3. **Login con redirección** (`?redirect=`).
4. **Layout de administración** con `AdminSidebar`.
5. **SEO por página**, **estilos globales**, **runtime config por entorno** y más.
6. **(Opcional)** Un **plugin** `$api` para centralizar las llamadas a la API.

### Árbol final

```md
-| app/
---| app.vue
---| assets/
-----| main.css              # ← NUEVO (reset + estilos base)
---| components/
-----| AppHeader.vue
-----| AppFooter.vue
-----| AdminSidebar.vue      # ← NUEVO
---| composables/
-----| useCart.ts            # carrito con cantidades
---| layouts/
-----| default.vue
-----| admin.vue             # layout completo (header + sidebar)
---| middleware/
-----| auth.ts               # con ?redirect=
---| pages/
-----| index.vue
-----| login.vue
-----| admin.vue
-----| products/[id].vue
---| types/
-----| product.ts
-| server/                   # ← NUEVO (backend Nitro)
---| api/
-----| products.ts
-----| products/[id].get.ts
---| data/
-----| products.ts
-| nuxt.config.ts
```

> 🔁 Fíjate en el movimiento de los datos: **ayer** vivían en `app/data/products.ts` (en el
> front); **hoy** los movemos a `server/data/products.ts` y los servimos desde la API. El
> archivo `app/data/products.ts` acaba **borrándose** cuando las páginas usan `useFetch`.
>
> El paso **opcional** del plugin (último de la guía) sí añadiría `app/plugins/api.ts`.

---

## Paso 1 · Backend integrado con Nitro (`server/`)

**¿Qué es?** Nuxt incluye **Nitro**, un motor de servidor. Cualquier archivo dentro de
`server/api/` se convierte automáticamente en un **endpoint HTTP**. No necesitamos Express
ni un backend aparte: el mismo proyecto sirve el frontend **y** la API.

**¿Por qué?** En la hora 1 teníamos los productos **a fuego** en el front
(`app/data/products.ts`). Ahora montamos una API de verdad: **movemos los datos al
servidor** y los servimos vía HTTP, con SSR, tipado automático y errores HTTP reales.

### 1.1 · Mover los datos al servidor: `server/data/products.ts`

**Copia el contenido** de `app/data/products.ts` a `server/data/products.ts` (es el **mismo**
array): así el endpoint y, más adelante, el detalle pueden reutilizarlo.

```diff
+ // server/data/products.ts
+ import type { Product } from '~/types/product';
+
+ export const products: Product[] = [
+   {
+     id: 1,
+     name: '👕 Camiseta Lemoncode',
+     description:
+       'Hecha con limones de Murcia y con amor. Sólo en color amarillo.',
+     price: 20,
+   },
+   {
+     id: 2,
+     name: '☕ Taza de Vue',
+     description:
+       'Edición limitada como las limitadas ofertas de trabajo de Vue.',
+     price: 10,
+   },
+   {
+     id: 3,
+     name: '🖼️ Nitro Sticker Pack',
+     description:
+       'Pegatinas del mejor Server Engine para l@s mejores Engineers.',
+     price: 5,
+   },
+   {
+     id: 4,
+     name: '⌨️ Tecla de TypeScript',
+     description: 'Tecla de TypeScript que añade ": any" en cada press',
+     price: 10,
+   },
+ ];
```

### 1.2 · Listado de productos: `server/api/products.ts`

`defineEventHandler` define un manejador de petición. La URL la marca el nombre del
archivo: `server/api/products.ts` → `GET /api/products`.

```diff
+ // server/api/products.ts
+ import { products } from '../data/products';
+
+ export default defineEventHandler(() => {
+   return products;
+ });
```

### 1.3 · Detalle + errores 400/404: `server/api/products/[id].get.ts`

Los **corchetes** en el nombre (`[id]`) crean un **parámetro dinámico**, igual que en las
páginas. El sufijo `.get` restringe el endpoint al método `GET`. Leemos el parámetro con
`getRouterParam` y, si algo no cuadra, lanzamos un error HTTP con `createError`.

```diff
+ // server/api/products/[id].get.ts
+ import { products } from '../../data/products';
+ import { Product } from '~/types/product';
+
+ export default defineEventHandler((event) => {
+   const rawId = getRouterParam(event, 'id');
+   const id = Number(rawId);
+
+   // 400 si el id no es válido (vacío, NaN, no entero, negativo...)
+   if (!rawId || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
+     throw createError({
+       statusCode: 400,
+       statusMessage: 'Invalid product id',
+     });
+   }
+
+   const product = products.find((p: Product) => p.id === id);
+
+   // 404 si no existe
+   if (!product) {
+     throw createError({
+       statusCode: 404,
+       statusMessage: 'Product not found',
+     });
+   }
+
+   return product;
+ });
```

> 💡 **Rutas tipadas**: al consumir estos endpoints con `useFetch('/api/products')`,
> Nuxt **infiere automáticamente el tipo** de la respuesta. No hay que escribir genéricos.

---

## Paso 2 · Tipos: `interface` → `type` + `ProductId`

**¿Por qué?** Introducimos un alias `ProductId` para dar **semántica** a los ids (lo
usaremos en el carrito) y pasamos de `interface` a `type` (preferencia de estilo del
proyecto final; ambas valen).

```diff
  // app/types/product.ts
- export interface Product {
-   id: number;
+ export type ProductId = number;
+
+ export type Product = {
+   id: ProductId;
    name: string;
    description: string;
    price: number;
- }
+ };
```

---

## Paso 3 · Carrito con cantidades (`useCart`)

**¿Qué es?** Un **composable** que guarda el carrito en estado global con `useState`.
`useState` es la forma de Nuxt de tener estado compartido **compatible con SSR**: el
servidor lo serializa y el cliente lo **hidrata** sin perderlo.

**¿Por qué cambia?** En la hora 1 el carrito era un simple `Product[]` (una entrada por
clic). Ahora modelamos **líneas de carrito** con cantidad (`CartItem`), para sumar
unidades del mismo producto y calcular el precio total correctamente.

```diff
- import type { Product } from '~/types/product';
+ import type { Product, ProductId } from '~/types/product';
+
+ type CartItem = {
+   product: Product;
+   quantity: number;
+ };

- export const useCart = () => {
-   const items = useState<Product[]>('cart-items', () => []);
+ export function useCart() {
+   // Estado global: compartido entre SSR y cliente. Nuxt lo hidrata solo.
+   const items = useState<CartItem[]>('cart-items', () => []);

-   const addToCart = (product: Product) => {
-     items.value.push(product);
-   };
-
-   const remove = (id: number) => {
-     const idx = items.value.findIndex((p) => p.id === id);
-     if (idx !== -1) items.value.splice(idx, 1);
-   };
-
-   const totalItems = computed(() => items.value.length);
-   const totalPrice = computed(() =>
-     items.value.reduce((sum, p) => sum + p.price, 0),
-   );
+   const totalItems = computed(() =>
+     items.value.reduce((sum, item) => sum + item.quantity, 0)
+   );
+
+   const totalPrice = computed(() =>
+     items.value.reduce(
+       (sum, item) => sum + item.product.price * item.quantity,
+       0
+     )
+   );
+
+   function addToCart(product: Product, quantity = 1) {
+     const existing = items.value.find((i) => i.product.id === product.id);
+     if (existing) {
+       existing.quantity += quantity;
+       return;
+     }
+     items.value.push({ product, quantity });
+   }
+
+   function removeFromCart(productId: ProductId) {
+     items.value = items.value.filter((i) => i.product.id !== productId);
+   }

-   return { items, addToCart, remove, totalItems, totalPrice };
- };
+   return { items, totalItems, totalPrice, addToCart, removeFromCart };
+ }
```

---

## Paso 4 · Home (`pages/index.vue`): array → `useFetch`

**¿Qué es `useFetch`?** El composable recomendado para pedir datos en Nuxt. Hace la
petición **en el servidor** durante el SSR, transfiere el resultado al cliente como
*payload* (sin volver a pedirlo) y nos da `data`, `error`, `pending`, etc.

**¿Por qué cambia?** Ayer leíamos los datos del array `~/data/products` directamente. Ahora
pedimos al endpoint real `/api/products` con `useFetch`. Además mejoramos la UI: pasamos de
una `<ul>` simple a una **rejilla de tarjetas** con botón **"Añadir al carrito"**.

```diff
- <script setup lang="ts">
- import { products } from '~/data/products';
-
- const config = useRuntimeConfig();
-
- useSeoMeta({
-   title: `Productos · ${config.public.siteName}`,
-   description: 'Listado de productos',
- });
- </script>
-
- <template>
-   <section class="wrap">
-     <h1>Productos</h1>
-     <ul class="list">
-       <li v-for="p in products" :key="p.id" class="item">
-         <NuxtLink :to="`/products/${p.id}`">{{ p.name }}</NuxtLink>
-         <span class="price">{{ p.price }} €</span>
-       </li>
-     </ul>
-   </section>
- </template>
+ <template>
+   <div>
+     <h1>Home</h1>
+
+     <div class="grid">
+       <article v-for="p in products" :key="p.id" class="card">
+         <div class="row">
+           <h2 class="title">
+             <NuxtLink class="link" :to="`/products/${p.id}`">{{
+               p.name
+             }}</NuxtLink>
+           </h2>
+           <span class="price">{{ p.price }} €</span>
+         </div>
+         <p class="desc">{{ p.description }}</p>
+         <div class="row end">
+           <button type="button" class="btn" @click="addToCart(p)">
+             Añadir al carrito
+           </button>
+         </div>
+       </article>
+     </div>
+   </div>
+ </template>
+
+ <script setup lang="ts">
+ const config = useRuntimeConfig();
+
+ useSeoMeta({
+   title: `${config.public.siteName} · Products`,
+   description:
+     'A tiny Nuxt 4 e-commerce demo: SSR data fetching, Nitro API, state, and middleware.',
+ });
+
+ const { data: products } = await useFetch('/api/products');
+
+ const { addToCart } = useCart();
+ </script>
```

> Los estilos de la rejilla (`.grid`, `.card`, `.row`, etc.) van en el `<style scoped>`
> de la página. Puedes copiarlos tal cual de [`../ecommerce/app/pages/index.vue`](../ecommerce/app/pages/index.vue).

---

## Paso 5 · Detalle de producto (`pages/products/[id].vue`)

**¿Qué es?** La página de la **ruta dinámica** `/products/:id`. Lee el `id` de la ruta con
`useRoute()` y pide el producto al endpoint `/api/products/:id`.

**¿Por qué con `useFetch`?** Ayer buscábamos el producto en el array con `products.find()`.
Ahora lo pedimos al endpoint real `/api/products/:id`. Lo bueno: si el servidor responde
**400/404** (los `createError` del Paso 1), `useFetch` propaga ese error durante el SSR y
Nuxt muestra su **página de error** automáticamente — ya no hace falta la validación manual.

> ⚠️ **Nota**: en `../ecommerce` esta página está a medio hacer (es un *stub*
> `<h1>Product {{ id }}</h1>`), porque se construye **en directo** al final de la clase.
> Aquí mostramos la **versión completa y funcional**, que es el objetivo real de la sesión.

La plantilla y los estilos **no cambian** respecto a ayer; solo cambia cómo obtenemos el
producto en el `<script setup>`:

```diff
  <script setup lang="ts">
- import { products } from '~/data/products';
-
  const route = useRoute();
  const config = useRuntimeConfig();
  const { addToCart } = useCart();

- const rawId = route.params.id;
- const id = Number(rawId);
-
- // Validación en cliente: 400 si el id no es válido
- if (!rawId || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
-   throw createError({ statusCode: 400, statusMessage: '❌ Invalid product id!!' });
- }
-
- const product = products.find((p) => p.id === id);
-
- if (!product) {
-   throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true });
- }
+ const id = Number(route.params.id);
+
+ // useFetch llama al endpoint Nitro. Si responde 400/404,
+ // el error se propaga y Nuxt muestra la página de error.
+ const { data: product } = await useFetch(`/api/products/${id}`);

  useSeoMeta({
-   title: `${product.name} · ${config.public.siteName}`,
-   description: product.description,
+   title: `${product.value?.name ?? 'Producto'} · ${config.public.siteName}`,
+   description: product.value?.description ?? 'Detalles del producto',
  });
  </script>
```

> 🧹 Ya puedes **borrar `app/data/products.ts`**: los datos viven ahora en el servidor.

---

## Paso 6 · Middleware con redirección (`?redirect=`)

**¿Qué es un middleware de ruta?** Una función que se ejecuta **antes** de entrar en una
página. Sirve para proteger rutas (admin, checkout...). Si devuelve `navigateTo(...)`,
redirige antes de renderizar.

**¿Por qué cambia?** Antes redirigíamos a `/login` "a pelo". Ahora guardamos en la query
**a dónde quería ir** el usuario (`?redirect=/admin`), para devolverlo allí tras el login.

```diff
- export default defineNuxtRouteMiddleware(() => {
+ export default defineNuxtRouteMiddleware((to) => {
    const auth = useState<boolean>('auth', () => false);

-   if (!auth.value) {
-     return navigateTo('/login');
-   }
+   if (auth.value) return;
+
+   // "Fake auth" a propósito: usa estado en memoria (se resetea al refrescar).
+   // Perfecto para aprender middleware + protección de rutas.
+   return navigateTo({
+     path: '/login',
+     query: { redirect: to.fullPath },
+   });
  });
```

---

## Paso 7 · Login que respeta el `redirect`

**¿Qué es?** Un login **falso** (didáctico): un botón pone `auth = true` en el estado
global. Al iniciar sesión, leemos `route.query.redirect` y volvemos a esa página.

```diff
  <script setup lang="ts">
+ const route = useRoute();
+ const config = useRuntimeConfig();
+
+ useSeoMeta({
+   title: `Login · ${config.public.siteName}`,
+   description:
+     'Página de login fake usada para demostrar el middleware de Nuxt.',
+ });
+
  const auth = useState<boolean>('auth', () => false);

+ const redirectTo = computed(() => {
+   const q = route.query.redirect;
+   return typeof q === 'string' && q.length > 0 ? q : '/admin';
+ });
+
  function login() {
    auth.value = true;
-   navigateTo('/admin');
+   navigateTo(redirectTo.value);
  }
+
+ function logout() {
+   auth.value = false;
+ }
  </script>
```

En la plantilla mostramos el estado (✅/❌), los botones de iniciar/cerrar sesión y a dónde
se redirigirá. Copia el `<template>` y `<style scoped>` de
[`../ecommerce/app/pages/login.vue`](../ecommerce/app/pages/login.vue).

---

## Paso 8 · Layout de administración + `AdminSidebar`

**¿Qué es un layout?** Una "envoltura" reutilizable para las páginas (cabecera, pie,
barras laterales...). La página elige su layout con `definePageMeta({ layout: 'admin' })`.

**¿Por qué cambia?** El `layouts/admin.vue` de la hora 1 era un placeholder. Ahora montamos
un layout de panel: **cabecera** + **barra lateral** (`AdminSidebar`) + zona de contenido.

### 9.1 · Nuevo componente `AdminSidebar.vue`

```diff
+ <!-- app/components/AdminSidebar.vue -->
+ <script setup lang="ts">
+ const auth = useState<boolean>('auth', () => false);
+ </script>
+
+ <template>
+   <aside class="sidebar">
+     <h2 class="title">Admin</h2>
+
+     <div class="meta">
+       Auth: <strong>{{ auth ? '✅ ON' : '❌ OFF' }}</strong>
+     </div>
+
+     <nav class="nav">
+       <NuxtLink to="/">← Volver a la tienda</NuxtLink>
+       <NuxtLink to="/login">Login</NuxtLink>
+     </nav>
+   </aside>
+ </template>
+
+ <!-- estilos scoped: ver ../ecommerce/app/components/AdminSidebar.vue -->
```

### 9.2 · `layouts/admin.vue` completo

```diff
- <!-- layouts/admin.vue -->
  <template>
-   <div class="grid grid-cols-[220px_1fr] min-h-screen">
-     <aside class="p-4 border-r">Admin</aside>
-     <main class="p-6"><slot /></main>
-   </div>
+   <div class="page">
+     <AppHeader />
+
+     <div class="body">
+       <AdminSidebar />
+       <main class="main">
+         <slot />
+       </main>
+     </div>
+   </div>
  </template>
+
+ <style scoped>
+ .page { min-height: 100vh; background: #f8fafc; }
+ .body {
+   display: grid;
+   grid-template-columns: 260px 1fr;
+   min-height: calc(100vh - 64px);
+ }
+ .main { padding: 24px 16px; max-width: 980px; }
+ @media (max-width: 860px) {
+   .body { grid-template-columns: 1fr; }
+ }
+ </style>
```

### 9.3 · Página `pages/admin.vue` = dashboard del carrito

Antes era un placeholder ("Bienvenido al panel"). Ahora muestra el **estado de auth** y el
**contenido del carrito** (demostrando el estado global), con `useSeoMeta`.

```diff
  <script setup lang="ts">
- definePageMeta({ layout: 'admin', middleware: 'auth' });
+ const config = useRuntimeConfig();
+ const auth = useState<boolean>('auth', () => false);
+ const { items, totalItems, totalPrice, removeFromCart } = useCart();
+
+ definePageMeta({
+   layout: 'admin',
+   middleware: 'auth',
+ });
+
+ useSeoMeta({
+   title: `Admin · ${config.public.siteName}`,
+   description: 'Página protegida demo: protegida por el middleware de rutas.',
+ });
  </script>

  <template>
-   <section>
-     <h1>Panel de control</h1>
-     <p>Bienvenido al panel de administración.</p>
+   <section class="panel">
+     <h1 class="main-title">Admin</h1>
+     <!-- info de auth + layout + middleware -->
+
+     <h2>Carrito (demo de estado global)</h2>
+     <div v-if="items.length === 0" class="empty">
+       Tu carrito está vacío (por favor, sé un poco más consumista).
+     </div>
+     <ul v-else class="list">
+       <li v-for="i in items" :key="i.product.id" class="row">
+         <div>
+           <strong>{{ i.product.name }}</strong>
+           <span class="muted">&nbsp;× {{ i.quantity }}</span>
+         </div>
+         <button type="button" class="btnSecondary" @click="removeFromCart(i.product.id)">
+           Eliminar
+         </button>
+       </li>
+     </ul>
    </section>
  </template>
```

> El bloque completo (con todos los `<p class="hint">` y el `<style scoped>`) está en
> [`../ecommerce/app/pages/admin.vue`](../ecommerce/app/pages/admin.vue).

---

## Paso 9 · Cabecera y pie

**Cabecera (`AppHeader.vue`)**: la marca pasa de ser un enlace a un texto estático,
reorganizamos los enlaces (Home / Login / Admin) y el carrito se muestra con `totalItems` y
`totalPrice`. (El componente ya usa `useCart`, `useState('auth')` y `useRuntimeConfig`.)

**Pie (`AppFooter.vue`)**: quitamos la línea de autoría para dejarlo más limpio.

```diff
  <span>⋅ 🍋 Lemoncode Shop 2026</span>
- <span
-   >⋅ Hecho por Paul Melero (<NuxtLink to="https://www.graficos.net"
-     >Graficos.net</NuxtLink
-   >)</span
- >
```

---

## Paso 10 · SEO por página (`useSeoMeta`)

**¿Qué es?** Un composable para definir `title`, `description` y etiquetas Open Graph
**por página**, de forma reactiva (cambian con los datos). Mejora el SEO y cómo se ve el
enlace al compartirlo.

Ya lo hemos ido añadiendo en los pasos anteriores. Resumen de dónde vive:

- `index.vue` → título con el nombre del sitio.
- `products/[id].vue` → título y descripción **según el producto**.
- `admin.vue` y `login.vue` → títulos propios.

```ts
useSeoMeta({
  title: `${product.value?.name} · ${config.public.siteName}`,
  description: product.value?.description,
});
```

---

## Paso 11 · Estilos globales (`app/assets/main.css`)

**¿Qué es?** Una hoja de estilos global con un **CSS reset** (basado en el de
Josh Comeau) más utilidades del proyecto (`.btn`, `.main-title`, enlaces). Se carga desde
`nuxt.config.ts` con la opción `css`.

```diff
+ /* app/assets/main.css */
+ /* Reset moderno (box-sizing, márgenes, media defaults, etc.) */
+ *, *::before, *::after { box-sizing: border-box; }
+ *:not(dialog) { margin: 0; }
+ body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
+ img, picture, video, canvas, svg { display: block; max-width: 100%; }
+ input, button, textarea, select { font: inherit; }
+
+ /* Utilidades del proyecto */
+ .btn {
+   border: none; background: #fef07c; color: #000;
+   border-radius: 10px; padding: 8px 10px; cursor: pointer; font-weight: 700;
+ }
+ .btn:hover { filter: brightness(0.95); }
+ .main-title { color: #6a6120; font-weight: 700; }
```

> El archivo completo (con todos los pasos del reset) está en
> [`../ecommerce/app/assets/main.css`](../ecommerce/app/assets/main.css).

---

## Paso 12 · `nuxt.config.ts`

**¿Qué cambia?**

- `css`: carga la hoja de estilos global del Paso 12.
- `devServer.port`: arrancamos en el **3333** (para no chocar con otros proyectos).
- `features.inlineStyles`: inyecta los estilos críticos en el HTML del SSR.
- `runtimeConfig.public.siteName`: ahora se puede sobreescribir con la variable de
  entorno `NUXT_PUBLIC_SITE_NAME`. **Runtime config** es la forma de Nuxt de exponer
  configuración; lo que va en `public` llega al cliente, el resto se queda en el servidor.

```diff
  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
+   devServer: {
+     port: 3333,
+   },
+   css: ['~/assets/main.css'],
+   features: {
+     inlineStyles: true,
+   },
    runtimeConfig: {
      public: {
-       siteName: '🍋 Lemoncode Shop 2026',
+       // Runtime config pública: llega al bundle del cliente.
+       siteName:
+         process.env.NUXT_PUBLIC_SITE_NAME ?? '🍋 Lemoncode Shop × Nuxt 4',
      },
    },
  });
```

> ℹ️ **No tocamos las versiones de Nuxt/Vue/vue-router** del `package.json`: usamos las que
> ya tienes instaladas en este proyecto.

---

## Paso 13 · `app.vue`: accesibilidad con `NuxtRouteAnnouncer`

**¿Qué es?** Un componente de Nuxt que **anuncia los cambios de ruta** a los lectores de
pantalla (accesibilidad). Lo envolvemos junto al layout y la página.

```diff
  <template>
-   <NuxtLayout>
-     <NuxtPage />
-   </NuxtLayout>
+   <div>
+     <NuxtRouteAnnouncer />
+
+     <NuxtLayout>
+       <NuxtPage />
+     </NuxtLayout>
+   </div>
  </template>
```

---

## Paso 14 · (Opcional) Plugins: centralizar la API con `$api`

**¿Qué es un plugin?** Código que Nuxt ejecuta al arrancar la app (en servidor y/o cliente)
y que puede **inyectar** cosas en el contexto con `provide`. Un uso típico: exponer un
**cliente HTTP** ya configurado (baseURL, cabeceras, interceptores...) como `$api`, para no
repetir `/api/...` en cada página.

```diff
+ // app/plugins/api.ts
+ export default defineNuxtPlugin(() => {
+   // Cliente con baseURL fija: un único sitio para baseURL, headers, etc.
+   const api = $fetch.create({ baseURL: '/api' });
+   return { provide: { api } };
+ });
```

Y para usarlo en una página, lo recuperamos con `useNuxtApp()`. ⚠️ **Importante**: `$api`
es un `$fetch`, así que **envuélvelo en `useAsyncData`** (si no, se ejecuta dos veces: una
en el servidor y otra en el cliente — justo lo que vimos en las slides):

```diff
- const { data: products } = await useFetch('/api/products');
+ const { $api } = useNuxtApp();
+ const { data: products } = await useAsyncData('products', () => $api('/products'));
```

> 🤔 **¿Merece la pena?** Solo si vas a compartir baseURL, cabeceras de auth o
> interceptores entre muchas llamadas. Para esta tienda, `useFetch('/api/...')` directo es
> suficiente: por eso la app de referencia [`../ecommerce`](../ecommerce) **no** incluye
> este plugin. Lo dejamos como paso opcional para que entiendas **cuándo** y **por qué**
> usar plugins.

---

## ✅ Cómo arrancar y comprobar

```bash
pnpm install
pnpm dev   # arranca en http://localhost:3333
```

Comprueba que:

1. **Home** lista 4 productos desde `/api/products` (tarjetas + "Añadir al carrito").
2. **Detalle** `/products/1` carga el producto; `/products/999` muestra **404**;
   `/products/abc` muestra **400**.
3. El **carrito** suma cantidades (añade el mismo producto dos veces → `× 2`).
4. **Admin** redirige a `/login?redirect=/admin` si no hay sesión; tras "Iniciar sesión"
   vuelves a `/admin` y ves el contenido del carrito.
5. El `title` de la pestaña cambia por página (SEO).

### Checklist de conceptos de Nuxt vistos

- [ ] Backend con **Nitro** (`server/api/*`) + errores con `createError`
- [ ] **Rutas tipadas** y `getRouterParam`
- [ ] Data fetching SSR-friendly con **`useFetch`**
- [ ] Estado global con **`useState`** (carrito y auth)
- [ ] **Middleware** de rutas + redirección con query
- [ ] **Layouts** (`default` / `admin`) y `definePageMeta`
- [ ] **SEO** por página con `useSeoMeta`
- [ ] **Runtime config** por entorno
- [ ] **Estilos globales** vía `nuxt.config`
