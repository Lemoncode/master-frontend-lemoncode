# Server Streaming

## SSG SSR e Híbrido

Hasta ahora hemos estado trabajando en modo SSG, es decir, Static Site Generation.
Esto significa que Astro ejecuta tu código en tiempo de build y genera un sitio completamente estático, con archivos HTML ya listos para servir desde un CDN o un hosting estático.

Pero Astro también soporta Server Side Rendering, o SSR, que consiste en generar la página cada vez que alguien la pide al servidor.

Y lo mejor... es que Astro trabaja en un modo híbrido de forma nativa.

**¿Que significa esto de modo híbrido?**

Eso quiere decir que puedes tener:

- Páginas que se generan una sola vez en el build (SSG).

- Y otras páginas que se generan bajo demanda (SSR) cuando llega una petición.

Con lo que sólo tienes que marcar las páginas que quieres servir de servidor con un flag (prerender a false), y con esto Astro no generará un archivo HTML estático para esa ruta en el build, sino que la renderizará en tiempo real cuando alguien la visite.

Esto te permite optimizar el rendimiento: usar contenido estático cuando no cambia, y SSR solo donde necesitas datos frescos o contenido dinámico.

## Creando el proyecto

Vamos a poner toda esta teoría en práctica.

Lo primero que vamos a hacer es crear un nuevo proyecto, esto es una oportunidad estupenda para que práctiques, intenta crear un proyecto en blanco por tu cuenta, repasa las guías de los primeros módulos, dale a la pausa e intentalo.

Vamos con la solución.

Primero, creamos un nuevo proyecto Astro:

```bash
npm create astro@latest
```

Ahora queremos que nuestro proyecto soporte SSR, así que necesitamos añadir un adaptador de servidor.
En este caso usaremos el de Node.js ¿Te acuerdas como hicimos eso? Dale a la pausa e intentalo.

instalamos el adaptador de nodejs para astro:

```bash
npm install @astrojs/node
```

Y lo añadimos al `astro.config.mjs`:

_./astro.config.mjs_

```diff
// @ts-check
import { defineConfig } from 'astro/config';
+ import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
+  adapter: node({
+    mode: 'standalone',
+  }),
});
```

## Cargando imágenes dese la API

Vamos a crear una pequeña API para obtener imágenes aleatorias de perros y gatos.
Creamos una carpeta api dentro de `src` y un archivo `animal.api.ts`, esto puedes intentar sacarlo tú, animate, dale a la pausa e intentalo.

La solucíon:

_./src/api/animal.api.ts_

```ts
export async function getRandomDogImage(): Promise<string> {
  const imageError =
    "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";

  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const response: { message?: string } = await res.json();
  return response?.message ?? imageError;
}

export async function getRandomCatImage(): Promise<string> {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data: { url: string }[] = await res.json();
  return data[0].url;
}
```

## Mostrando las imágenes

Ahora usamos esas funciones en nuestra página principal.

_./src/index.astro_

```astro
---
import {getRandomDogImage, getRandomCatImage} from '../api/animal.api.ts';

const dogImage = await getRandomDogImage();
const catImage = await getRandomCatImage();
---

<html>
  <head>
    <meta charset="UTF-8" />
    <title>Random Dog and Cat Images</title>
  </head>
  <body>
    <h1>🐶 Random Dog Image</h1>
    <img
      src={dogImage}
      style="max-width: 400px"
    />

    <h1>🐱 Random Cat Image</h1>
    <img
      src={catImage}
      style="max-width: 400px"
    />
  </body>
</html>
```

Si hacemos un build, veremos que Astro genera un HTML estático (miramos la carpeta `dist`).

Ahora convertimos esta página en SSR añadiendo una línea:

_./src/index.astro_

```diff
---
+ export const prerender = false;
const dogImage = await getRandomDogImage();
const catImage = await getRandomCatImage();
---
```

Si volvemos a hacer el build, ya no se generará un HTML estático:
Astro creará un módulo en `dist/server/pages/_index.astro` que renderiza el HTML en cada petición.

## Simulando una respuesta lenta

Vamos a simular que la carga del gato es lenta (ya sabes, los gatos van a su ritmo 😸).

```diff
export async function getRandomCatImage(): Promise<string> {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data: { url: string }[] = await res.json();

+  // ⏳ Add a 5-second delay
+  await new Promise(resolve => setTimeout(resolve, 5000));

  return data[0].url;
}
```

Si recargas la página, verás que todo tarda más en aparecer: hasta que el fetch del gato termina, no se muestra nada.

Y aquí es donde entra en juego el server streaming.

## Qué es el Server Streaming

En modo SSR, Astro puede enviar el HTML por partes, esto se llama HTML streaming.

La idea es que el servidor no espere a renderizar todo para enviar la respuesta:
puede empezar a mandar el contenido que ya está listo (por ejemplo, el título o la imagen del perro),
mientras los componentes más lentos se generan en segundo plano.

Así el usuario ve algo antes, y la página parece mucho más rápida.

## Componentizando el ejemplo

Vamos a dividir nuestra página en dos componentes:

_./src/components/dog.astro_

```astro
---
import {getRandomDogImage} from '../api/animal.api';
const dogImage = await getRandomDogImage();
---
<h1>🐶 Random Dog Image</h1>
<img
  src={dogImage}
  style="max-width: 400px"
/>
```

_./src/components/cat.astro_

```astro
---
import { getRandomCatImage} from '../api/animal.api';
const catImage = await getRandomCatImage();
---

<h1>🐱 Random Cat Image</h1>
<img
  src={catImage}
  style="max-width: 400px"
/>
```

Y lo usamos en la página.

_./src/index.astro_

```diff
---
export const prerender = false;
+ import Dog from '../components/dog.astro';
+ import Cat from '../components/cat.astro';
- import {getRandomDogImage, getRandomCatImage} from '../api/animal.api';
- const dogImage = await getRandomDogImage();
- const catImage = await getRandomCatImage();
---

<html>
  <head>
    <meta charset="UTF-8" />
    <title>Random Dog and Cat Images</title>
  </head>
  <body>
+    <Dog/>
+    <Cat/>
-    <h1>🐶 Random Dog Image</h1>
-    <img
-      src={dogImage}
-      style="max-width: 400px"
-    />
-
-    <h1>🐱 Random Cat Image</h1>
-    <img
-      src={catImage}
-      style="max-width: 400px"
-    />
  </body>
</html>
```

## Magia del streaming (sin hacer nada extra)

Si probamos esto, verás que la imagen del perro aparece enseguida, y la del gato se carga unos segundos después.

¿Y lo curioso? ¡No hemos hecho nada especial!

Astro ya hace server streaming por defecto en SSR, y renderiza los componentes de forma asíncrona cuando puede.

## Controlando el streaming con server:defer

Ahora bien, en algunos casos —por ejemplo, si el layout o algún componente hace await antes del `<slot />` ese streaming puede quedar bloqueado.

Si queremos asegurarnos de que un componente no retrasa el envío inicial, podemos usar la directiva `server:defer.`

Le decimos a Astro:

“No esperes a renderizar este componente. Envíame el resto de la página y cuando esté listo, lo inyectas.”

Y además... `server:defer` nos permite añadir un indicador de que ese trozo de HTML se está cargando:


```diff
    <Dog/>
-    <Cat/>
+    <Cat server:defer>
+			<div slot="fallback">
+  			<span style="color: green; font-size: 2.5rem;">🐱 Loading cat fact...</span>
+			</div>
+		</Cat>
  </body>
```

## Resumen

- SSG: el HTML se genera en el build.

- SSR: el HTML se genera en cada petición.

- Modo híbrido: Astro permite combinar ambos, sin configuración adicional.

- `prerender = false`: marca una página para renderizarla dinámicamente (SSR).

- Server streaming: Astro puede enviar el HTML por partes, acelerando el renderizado.

- `server:defer`: fuerza que un componente se renderice de forma diferida y no bloquee el envío inicial.
