# 🍋 De cero a la mini‑app — Guía paso a paso (Nuxt 4) · Día 1

Esta guía explica **cómo construir esta mini‑app** desde un proyecto Nuxt 4 recién
creado. Es el material de la **primera hora** ("Nuxt I"): una tienda sencilla con
páginas, layouts, estado global y un carrito básico.

- La **prosa** está en español (es material de clase).
- El **código** está en inglés, igual que en el proyecto final.
- Cada paso explica **qué es** la funcionalidad, **por qué** la usamos y muestra el
  **código** (o un **diff**) con los cambios exactos.

> Convención de los diff: las líneas con `-` se **quitan**, las líneas con `+` se
> **añaden**. Los archivos **nuevos** se muestran enteros (sin `+/-`), porque no hay
> nada previo que comparar.

> 🔜 **¿Y la segunda hora?** En el **Día 2** evolucionamos esta misma mini‑app hasta
> una tienda con backend real. Todo eso (Nitro, `useFetch`, carrito con cantidades,
> login con `?redirect=`, etc.) está en
> [`../02-ecommerce/README.md`](../02-ecommerce/README.md) y el resultado final en
> [`../ecommerce`](../ecommerce). En esta guía verás varias notas «esto llega en el Día 2».

---

## 🎯 Objetivo del Día 1

Partimos de un proyecto Nuxt **vacío** (recién scaffoldeado) y llegamos a una mini‑app
de e‑commerce que tiene:

1. **App shell** (`app.vue`) con `NuxtLayout` + `NuxtPage`.
2. **Rutas por archivos**: Home, detalle de producto (`/products/:id`), login y admin.
3. **Layouts** reutilizables (`default` público y `admin`).
4. **Estado global sin librerías** con `useState`: un **carrito** y un flag de **auth**.
5. **Middleware** de ruta para proteger `/admin`.
6. **SEO por página** con `useSeoMeta` y **runtime config** con el nombre del sitio.

Los **datos de los productos** están **a fuego en el front** (`app/data/products.ts`).
Es lo justo para el Día 1: sin backend, sin base de datos. (En el Día 2 los moveremos a
una API real con Nitro.)

### Árbol final (lo que construimos hoy)

```md
-| app/
---| app.vue
---| components/
-----| AppHeader.vue
-----| AppFooter.vue
---| composables/
-----| useCart.ts            # carrito simple (Product[])
---| data/
-----| products.ts          # productos "a fuego" en el front
---| layouts/
-----| default.vue          # layout público (header + footer)
-----| admin.vue            # placeholder (se completa en el Día 2)
---| middleware/
-----| auth.ts              # protección básica → /login
---| pages/
-----| index.vue            # Home (listado)
-----| login.vue            # login fake
-----| admin.vue            # panel protegido
-----| products/
-------| [id].vue           # detalle (ruta dinámica)
---| types/
-----| product.ts
-| nuxt.config.ts
```

> 🔁 Compáralo con el Día 2: hoy **no** hay carpeta `server/`, el carrito es un simple
> `Product[]` y el layout `admin.vue` es un placeholder. Todo eso evoluciona mañana.

---

## Paso 1 · Crear el proyecto (scaffold)

**¿Qué es?** Nuxt trae un asistente que genera un proyecto listo para arrancar
(*zero‑config*): estructura de carpetas, `nuxt.config.ts`, scripts de npm, etc.

```bash
# Crea el proyecto (elige pnpm como gestor de paquetes)
npm create nuxt@latest 01-ecommerce

cd 01-ecommerce
pnpm install
pnpm dev
```

El scaffold incluye un `app/app.vue` de bienvenida (un componente `<NuxtWelcome />`) y un
`nuxt.config.ts` mínimo. **No nos vamos a centrar en ese código de ejemplo**: en los
siguientes pasos lo sustituimos por los archivos de nuestra tienda.

> 💡 **Auto‑imports**: en Nuxt no hace falta importar `ref`, `computed`, `useState`,
> `useRoute`, tus **componentes** (`components/`) ni tus **composables** (`composables/`).
> Nuxt los inyecta automáticamente. Por eso verás código sin `import` para esas cosas.

---

## Paso 2 · App shell (`app/app.vue`)

**¿Qué es?** `app.vue` es el **componente raíz** de toda la app. Aquí declaramos dos
componentes de Nuxt:

- **`<NuxtLayout>`** → pinta el **layout** activo (la "envoltura" común: cabecera, pie…).
- **`<NuxtPage>`** → pinta la **página** que corresponde a la URL actual (el sistema de
  rutas por archivos).

**¿Por qué?** Es el patrón estándar de Nuxt: el layout envuelve a la página. Sustituimos
el `app.vue` de bienvenida del scaffold por esto:

```diff
- <template>
-   <div>
-     <NuxtRouteAnnouncer />
-     <NuxtWelcome />
-   </div>
- </template>
+ <template>
+   <NuxtLayout>
+     <NuxtPage />
+   </NuxtLayout>
+ </template>
```

---

## Paso 3 · Tipos (`app/types/product.ts`)

**¿Qué es?** Una `interface` de TypeScript que describe la forma de un producto. La
usaremos en los datos, el carrito y las páginas para tener **autocompletado** y evitar
errores.

**¿Por qué primero?** Porque el resto de archivos (datos, composable, páginas) la van a
**importar**. Conviene tenerla antes.

```ts
// app/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}
```

---

## Paso 4 · Datos "a fuego" (`app/data/products.ts`)

**¿Qué es?** Un array de productos **escrito directamente en el front**. Es nuestra
"base de datos" del Día 1.

**¿Por qué así?** Para centrarnos en Nuxt (rutas, estado, layouts) sin montar todavía un
backend. Importaremos este array directamente desde las páginas.

```ts
// app/data/products.ts
import type { Product } from '~/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: '👕 Camiseta Lemoncode',
    description:
      'Hecha con limones de Murcia y con amor. Sólo en color amarillo.',
    price: 20,
  },
  {
    id: 2,
    name: '☕ Taza de Vue',
    description:
      'Edición limitada como las limitadas ofertas de trabajo de Vue.',
    price: 10,
  },
  {
    id: 3,
    name: '🖼️ Nitro Sticker Pack',
    description:
      'Pegatinas del mejor Server Engine para l@s mejores Engineers.',
    price: 5,
  },
  {
    id: 4,
    name: '⌨️ Tecla de TypeScript',
    description: 'Tecla de TypeScript que añade ": any" en cada press',
    price: 10,
  },
];
```

> 🔜 **Día 2**: estos datos se moverán a `server/data/products.ts` y se servirán desde
> una API con Nitro (`/api/products`). Hoy viven en el front.

---

## Paso 5 · Rutas por archivos + Home (`app/pages/index.vue`)

**¿Qué son las rutas por archivos?** En Nuxt, **cada archivo dentro de `app/pages/` se
convierte en una ruta** automáticamente. No hay que configurar el router a mano:

- `pages/index.vue` → `/`
- `pages/login.vue` → `/login`
- `pages/products/[id].vue` → `/products/:id` (ruta **dinámica**, lo vemos en el Paso 6)

**La Home.** Importa el array de productos, los pinta en una lista y enlaza al detalle
de cada uno con **`<NuxtLink>`** (el `<a>` de Nuxt, que navega sin recargar la página).
También fija el **título de la pestaña** con `useSeoMeta` y lee el nombre del sitio desde
`useRuntimeConfig` (ver Paso 13).

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
import { products } from '~/data/products';

const config = useRuntimeConfig();

useSeoMeta({
  title: `Productos · ${config.public.siteName}`,
  description: 'Listado de productos',
});
</script>

<template>
  <section class="wrap">
    <h1>Productos</h1>
    <ul class="list">
      <li v-for="p in products" :key="p.id" class="item">
        <NuxtLink :to="`/products/${p.id}`">{{ p.name }}</NuxtLink>
        <span class="price">{{ p.price }} €</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}
.list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}
.item:last-child {
  border-bottom: none;
}
.price {
  font-weight: 700;
}
</style>
```

---

## Paso 6 · Detalle de producto (`app/pages/products/[id].vue`)

**¿Qué es una ruta dinámica?** Los **corchetes** en el nombre del archivo (`[id].vue`)
crean un **parámetro** en la URL. Así, `/products/1` y `/products/42` usan la misma
página, cambiando solo el `id`.

**¿Cómo funciona?**

- `useRoute()` nos da acceso a la ruta actual; leemos el parámetro con `route.params.id`.
- Validamos el `id`. Si no es válido o el producto no existe, lanzamos un error HTTP con
  **`createError`** y Nuxt muestra automáticamente su **página de error** (400 / 404).
- Buscamos el producto en el array con `products.find()`.
- El botón "Añadir al carrito" llama a `addToCart` del composable `useCart` (Paso 7).

```vue
<!-- app/pages/products/[id].vue -->
<script setup lang="ts">
import { products } from '~/data/products';

const route = useRoute();
const config = useRuntimeConfig();
const { addToCart } = useCart();

const rawId = route.params.id;
const id = Number(rawId);

if (!rawId || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
  throw createError({
    statusCode: 400,
    statusMessage: '❌ Invalid product id!!',
  });
}

const product = products.find((p) => p.id === id);

if (!product) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
    fatal: true,
  });
}

useSeoMeta({
  title: `${product.name} · ${config.public.siteName}`,
  description: product.description,
});
</script>

<template>
  <section v-if="product" class="wrap">
    <NuxtLink class="back" to="/">← Volver</NuxtLink>

    <h1>{{ product.name }}</h1>
    <p class="desc">{{ product.description }}</p>

    <div class="row">
      <span class="price">{{ product.price }} €</span>
      <button type="button" class="btn" @click="addToCart(product)">
        Añadir al carrito
      </button>
    </div>
  </section>
</template>

<style scoped>
.wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}
.back {
  display: inline-block;
  margin-bottom: 12px;
  color: #6a6120;
  text-decoration: none;
}
.back:hover {
  text-decoration: underline;
}
.desc {
  color: #4b5563;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}
.price {
  font-weight: 700;
}
</style>
```

> 🔜 **Día 2**: en lugar de `products.find()`, pediremos el producto a la API real con
> `useFetch('/api/products/:id')`, y la validación 400/404 vivirá en el servidor.

---

## Paso 7 · Estado global sin librerías (`app/composables/useCart.ts`)

**¿Qué es un composable?** Una función reutilizable (`useAlgo`) que encapsula lógica con
estado. Aquí creamos `useCart` para el carrito de la compra.

**¿Qué es `useState`?** Es la forma de Nuxt de tener **estado global compartido y
compatible con SSR**. La clave (`'cart-items'`) identifica el estado: el servidor lo
serializa y el cliente lo **hidrata** sin perderlo. Cualquier componente que llame a
`useCart()` ve el **mismo** carrito.

**El carrito del Día 1 es simple**: guardamos un `Product[]`. Cada vez que añades, se hace
`push` del producto (sin agrupar por cantidades). `totalItems` es el número de entradas y
`totalPrice` suma los precios.

```ts
// app/composables/useCart.ts
import type { Product } from '~/types/product';

export const useCart = () => {
  const items = useState<Product[]>('cart-items', () => []);

  const addToCart = (product: Product) => {
    items.value.push(product);
  };

  const remove = (id: number) => {
    const idx = items.value.findIndex((p) => p.id === id);
    if (idx !== -1) items.value.splice(idx, 1);
  };

  const totalItems = computed(() => items.value.length);
  const totalPrice = computed(() =>
    items.value.reduce((sum, p) => sum + p.price, 0),
  );

  return { items, addToCart, remove, totalItems, totalPrice };
};
```

> 🔜 **Día 2**: el carrito pasa a modelar **líneas con cantidad** (`CartItem = { product,
> quantity }`), para sumar unidades del mismo producto. Hoy nos quedamos en el `Product[]`.

---

## Paso 8 · Cabecera y pie (`app/components/`)

**¿Qué es?** Componentes reutilizables. En Nuxt, todo lo que pongas en `app/components/`
se **auto‑importa**: puedes usar `<AppHeader />` y `<AppFooter />` en cualquier plantilla
sin escribir `import`.

**`AppHeader.vue`** es la barra de navegación: usa `<NuxtLink>` para Home/Admin/Login,
muestra el **resumen del carrito** (`totalItems` y `totalPrice` del composable) y un botón
de **cerrar sesión** que aparece solo si `auth` está activo (estado global, igual que el
carrito).

```vue
<!-- app/components/AppHeader.vue -->
<script setup lang="ts">
const { totalItems, totalPrice } = useCart();
const auth = useState<boolean>('auth', () => false);

const config = useRuntimeConfig();
const siteName = computed(() => config.public.siteName);

function logout() {
  auth.value = false;
  navigateTo('/');
}
</script>

<template>
  <header class="header">
    <nav class="nav">
      <NuxtLink class="brand main-title" to="/">{{ siteName }}</NuxtLink>

      <div class="links">
        <NuxtLink to="/">Productos</NuxtLink>
        <NuxtLink to="/admin">Panel de control</NuxtLink>
        <NuxtLink to="/login">Login</NuxtLink>
        <button v-if="auth" class="linkLike" type="button" @click="logout">
          Cerrar sesión
        </button>
        <span class="cart">
          🛒 Carrito: <strong class="tabular-nums">{{ totalItems }}</strong> ·
          <strong class="tabular-nums">{{ totalPrice }} €</strong>
        </span>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid #e5e7eb;
  background: white;
}
.nav {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand {
  text-decoration: none;
}
.links {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cart {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: 14px;
}
.linkLike {
  background: transparent;
  border: none;
  padding: 0;
  color: #6a6120;
  cursor: pointer;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
```

Y el **pie** (`AppFooter.vue`), sencillo:

```vue
<!-- app/components/AppFooter.vue -->
<template>
  <footer class="footer">
    <div class="inner">
      <span
        >Demo de e-commerce con <strong>Nuxt 4</strong> (Nitro + SSR + useState
        + middleware)</span
      >
      <span>⋅ 🍋 Lemoncode Shop 2026</span>
      <span
        >⋅ Hecho por Paul Melero (<NuxtLink to="https://www.graficos.net"
          >Graficos.net</NuxtLink
        >)</span
      >
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid #e5e7eb;
  background: white;
  margin-top: 40px;
  text-align: center;
}
.inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
}
</style>
```

> 💡 **Navegación programática**: además de `<NuxtLink>`, puedes navegar desde el
> `<script>` con `navigateTo('/ruta')` (lo usamos en `logout`) o con
> `useRouter().push('/ruta')`.

---

## Paso 9 · Layouts (`app/layouts/`)

**¿Qué es un layout?** Una "envoltura" reutilizable para las páginas (cabecera, pie,
barras laterales…). Evita duplicar UI. El `<slot />` es el hueco donde Nuxt mete la
página actual.

**`default.vue`** es el layout **público** (se aplica a todas las páginas que no pidan
otro): cabecera + contenido + pie.

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="page">
    <AppHeader />

    <main class="main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main {
  max-width: 980px;
  margin: 0 auto auto;
  padding: 24px 16px;
}
</style>
```

**`admin.vue`** es, de momento, un **placeholder**: una rejilla mínima con una barra
lateral de texto. Suficiente para demostrar que una página puede elegir **otro** layout.

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="grid grid-cols-[220px_1fr] min-h-screen">
    <aside class="p-4 border-r">Admin</aside>
    <main class="p-6"><slot /></main>
  </div>
</template>
```

> 🔜 **Día 2**: el layout `admin.vue` se completa con `AppHeader`, un componente
> `AdminSidebar` y estilos propios. Hoy es solo un placeholder.

---

## Paso 10 · Login + estado de auth (`app/pages/login.vue`)

**¿Qué es?** Un login **falso** (didáctico): un botón pone `auth = true` en el estado
global (`useState('auth')`) y navega a `/admin`. Como es estado en memoria, se **resetea
al refrescar** — perfecto para aprender middleware y protección de rutas.

```vue
<!-- app/pages/login.vue -->
<script setup lang="ts">
const auth = useState<boolean>('auth', () => false);

function login() {
  auth.value = true;
  navigateTo('/admin');
}
</script>

<template>
  <section class="wrap">
    <h1>Login</h1>
    <p>Demo: pulsa el botón para iniciar sesión.</p>
    <button type="button" class="btn" @click="login">Entrar</button>
  </section>
</template>

<style scoped>
.wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}
.btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fef9c3;
  cursor: pointer;
}
</style>
```

> 🔜 **Día 2**: el login leerá `?redirect=` de la URL para devolverte a la página desde
> la que te mandaron a iniciar sesión. Hoy siempre va a `/admin`.

---

## Paso 11 · Middleware de ruta (`app/middleware/auth.ts`)

**¿Qué es un middleware de ruta?** Una función que se ejecuta **antes** de entrar en una
página. Sirve para proteger rutas (admin, checkout…). Si devuelve `navigateTo(...)`,
redirige antes de renderizar.

Definimos el middleware con `defineNuxtRouteMiddleware`. Lee el flag global `auth` y, si
no hay sesión, manda a `/login`.

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useState<boolean>('auth', () => false);

  if (!auth.value) {
    return navigateTo('/login');
  }
});
```

> 🔜 **Día 2**: guardaremos a dónde quería ir el usuario con
> `navigateTo({ path: '/login', query: { redirect: to.fullPath } })`.

---

## Paso 12 · Página admin protegida (`app/pages/admin.vue`)

**¿Qué es `definePageMeta`?** La forma de Nuxt de dar **metadatos a una página**: qué
**layout** usa y qué **middleware** la protege.

Aquí decimos: usa el layout `admin` y aplica el middleware `auth`. Si entras sin sesión,
el middleware del Paso 11 te manda a `/login`.

```vue
<!-- app/pages/admin.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' });
</script>

<template>
  <section>
    <h1>Panel de control</h1>
    <p>Bienvenido al panel de administración.</p>
  </section>
</template>
```

> 🔜 **Día 2**: esta página mostrará el contenido del carrito (demo de estado global) y el
> estado de auth. Hoy es una bienvenida sencilla.

---

## Paso 13 · Runtime config + SEO (`nuxt.config.ts`)

**¿Qué es la runtime config?** La forma de Nuxt de exponer **configuración** a la app. Lo
que va en `public` llega también al **cliente** (al bundle del navegador); el resto se
queda en el servidor. Lo leemos con `useRuntimeConfig()`.

Añadimos el **nombre del sitio** a la config del scaffold:

```diff
  // https://nuxt.com/docs/api/configuration/nuxt-config
  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
+   runtimeConfig: {
+     public: {
+       siteName: '🍋 Lemoncode Shop 2026',
+     },
+   },
  })
```

**¿Y el SEO?** Ya lo hemos ido añadiendo en las páginas con **`useSeoMeta`**, que define
`title`/`description` **por página** de forma reactiva (cambian con los datos). Resumen de
dónde vive:

- `index.vue` → título con el nombre del sitio (`config.public.siteName`).
- `products/[id].vue` → título y descripción **según el producto**.

```ts
useSeoMeta({
  title: `${product.name} · ${config.public.siteName}`,
  description: product.description,
});
```

> 🔜 **Día 2**: en `nuxt.config.ts` añadiremos estilos globales (`css`), un puerto de dev
> propio (`devServer.port`), `features.inlineStyles` y leeremos `siteName` de una variable
> de entorno. Hoy solo `siteName`.

---

## ✅ Cómo arrancar y comprobar

```bash
pnpm install
pnpm dev   # arranca en http://localhost:3000
```

Comprueba que:

1. **Home** (`/`) lista los 4 productos con su precio y enlaza a cada detalle.
2. **Detalle** `/products/1` carga el producto; `/products/999` muestra **404**;
   `/products/abc` muestra **400**.
3. El **carrito** de la cabecera sube al pulsar "Añadir al carrito" (nº de items y total).
4. **Admin** (`/admin`) te redirige a `/login` si no hay sesión; tras "Entrar" vuelves a
   `/admin` y aparece el botón "Cerrar sesión" en la cabecera.
5. El `title` de la pestaña cambia por página (SEO).

### Checklist de conceptos de Nuxt vistos (Día 1)

- [ ] **Rutas por archivos** (`pages/`) y rutas **dinámicas** (`[id].vue`)
- [ ] **App shell** con `NuxtLayout` + `NuxtPage`
- [ ] **Layouts** (`default` / `admin`) y `definePageMeta`
- [ ] **Navegación** con `NuxtLink` y `navigateTo`
- [ ] **Estado global** con `useState` (carrito y auth) vía un **composable**
- [ ] **Middleware** de ruta con `defineNuxtRouteMiddleware`
- [ ] **Error handling** con `createError` (400 / 404)
- [ ] **SEO** por página con `useSeoMeta`
- [ ] **Runtime config** con `useRuntimeConfig`
- [ ] **Auto‑imports** (componentes, composables y APIs de Vue/Nuxt)

> 🔜 **Siguiente**: continúa con la guía del **Día 2** en
> [`../02-ecommerce/README.md`](../02-ecommerce/README.md) para añadir el backend con
> Nitro, `useFetch`, el carrito con cantidades y el panel de administración completo.
