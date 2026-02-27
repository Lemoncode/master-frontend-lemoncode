# Server Streaming

Si estamos en modo SSR, cuando pedimos una página, esta se genera en el servidor y se envía al usuario en un sólo paquete.

¿ Qué pasa si tenemos una páigna rica que carga de diferentes fuentes de datos? Puede que uno de los fragmentos tarde más en llegar que otro, lo que puede hacer que la página tarde en cargarse, y muchas veces lo que nos interesa es que la página se cargue lo más rápido posible.

Una cosa interesante de Astro es que soporte streaming de HTML y de una forma muy sencilla e intituitiva.

## Manos a la obra

Vamos a crear dos páginas, una tirara de streaming de HTML y otra no.

_./src/pages/facts/NoStreaming.astro_

```astro
---
import Layout from "../../layouts/Layout.astro";
---

<Layout>
  <h1>No Streaming</h1>
</Layout>
```

_./src/pages/facts/Streaming.astro_

```astro
---
import Layout from "../../layouts/Layout.astro";

export const prerender = false;
---

<Layout>
  <h1>Streaming</h1>
</Layout>
```

Y en nuestro menú de cabecera vamos a añadir enlaces para poder navegar entre ellas:

_./src/components/Header.astro_

```diff
      <div class="menu__right">
+       <li><a href="/facts/Streaming" class="menu__item">Streaming</a></li>
+       <li><a href="/facts/NoStreaming" class="menu__item">No Streaming</a></li>
        <li><a href="/" class="menu__item">All Post</a></li>
        <li><a href="/about/" class="menu__item">About</a></li>
      </div>

```

Probamos que podemos navegar entre las dos páginas.

Vamos al lio, creamos dos APIs simuladas, una que te de un datos sobre gatitos y otra sobre perritos, la de perritos le vamos a meter un delay de 5 segundos para simular que tarda más en llegar.

_./src/pages/facts/cat-fact.api.ts_

```ts
export async function getCatFact() {
  return "Cats sleep 70% of their lives. 🐱";
}
```

_./src/pages/facts/dog-fact.api.ts_

```ts
export async function getDogFact() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5s delay
  return "Dogs can learn more than 1000 words. 🐶";
}
```

Vamos a consumir esta API en nuestra página sin streaming:

_./src/pages/facts/NoStreaming.astro_

```diff
---
import Layout from "../../layouts/Layout.astro";
+ import { getCatFact } from "./cat-fact.api";
+ import { getDogFact } from "./dog-fact.api";
+
+ // IMPORTANTE, AQUI DECIMOS QUE VAMOS EN MODO SSR
+ // HIBRIDO
+ export const prerender = false;
+
+ const catFact = await getCatFact();
+ const dogFact = await getDogFact();
---

<Layout>
  <h1>No Streaming</h1>
+  <h2>Cat Fact</h2>
+  <p>{catFact}</p>
+  <h2>Dog Fact</h2>
+  <p>{dogFact}</p>
</Layout>
```

Si probamos a navegar a esta página, veremos que tarda 5 segundos en cargar, ya que estamos esperando a que llegue el dato de los perritos.

Vamos a hacer lo mismo en la página de streaming:

Para ello vamos a romper en componentes la sección que muestra los datos de los gatitos y los perritos:

_./src/pages/facts/components/CatFact.astro_

```astro
---
import { getCatFact } from "../cat-fact.api";

export const prerender = false;

const fact = await getCatFact();
---

<section>
  <h2>Cat Fact</h2>
  <p>{fact}</p>
</section>
```

_./src/pages/facts/components/DogFact.astro_

```astro
---
import { getDogFact } from "../dog-fact.api";

export const prerender = false;

const fact = await getDogFact();
---

<section>
  <h2>Dog Fact</h2>
  <p>{fact}</p>
</section>
```

Y ahora lo usamos tal cual en la página de streaming:

_./src/pages/facts/Streaming.astro_

```diff
---
import Layout from "../../layouts/Layout.astro";
+ import CatFact from "./components/CatFact.astro";
+ import DogFact from "./components/DogFact.astro";

export const prerender = false;
---

<Layout>
  <h2>Streaming</h2>
+ <CatFact />
+ <DogFact />
</Layout>
```

Lo probamos y podemos ver como la página se carga al instante, y los datos de los gatitos llegan antes que los de los perritos.

## BONUS

¿Y si queremos mostrar un loader de la sección que se está cargando?

Aquí vamos a emplear un truco:

- Creamos un componente que tiene dos DIV hermanos.
- El primero DIV se muestra mientras el segundo DVI no sea visibile (esto lo hacemos con un selector de CSS).

Vamos a crear el component fallback:

_./src/components/LoadingFallback.astro_

```astro
---
//https://codehater.blog/articles/zero-js-progressive-loading/
---

<!-- LoadingFallback.astro -->
<div class="contents fallback">
  <slot name="fallback" />
</div>
<slot name="content" />

<style>
  .fallback:has(+ *) {
    display: none;
  }
</style>
```

Este componente está muy chulo, con un selector CSS mira si tiene un hermano y si lo tiene se oculta.

Y vamos a usarlo en nuestra página de streaming:

_./src/pages/facts/Streaming.astro_

```diff
---
import Layout from "../../layouts/Layout.astro";
import CatFact from "./components/CatFact.astro";
import DogFact from "./components/DogFact.astro";
+ import LoadingFallback from "../../components/LoadingFallback.astro";

export const prerender = false;
---

<Layout>
  <h2>Streaming</h2>
  <CatFact />
+  <LoadingFallback>
+   <div slot="fallback">🐶 Loading dog fact...</div>
-    <DogFact />
+   <DogFact slot="content" />
+   </LoadingFallback>
</Layout>
```

Y ya lo tenemos... :)

Otra opción es usar _server islands_, marcamos el componente como _server:defer_ y le añadimos un _fallback_

_./src/pages/facts/components/DogFact.astro_

```diff
<Layout>
  <h2>Streaming</h2>
  <CatFact />
-  <LoadingFallback>
-    <div slot="fallback">🐶 Loading dog fact...</div>
-    <DogFact slot="content" />
-  </LoadingFallback>
+  <DogFact server:defer>
+    <div slot="fallback">🐶 Loading dog fact..</div>
+  </DogFact>
</Layout>
```
