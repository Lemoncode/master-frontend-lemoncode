# Server Streaming

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

## SSG, SSR and Hybrid

- **SSG**: HTML generated at build.
- **SSR**: HTML generated per request.
- **Hybrid**: both in the same project — opt a page into SSR with `export const prerender = false`.

## 1. Create a new project

```bash
pnpm create astro@latest
```

```bash
pnpm approve-builds
```

## 2. Add the Node adapter (SSR)

```bash
pnpm add @astrojs/node
```

`./astro.config.mjs`

```diff
// @ts-check
import { defineConfig } from 'astro/config';
+ import node from '@astrojs/node';

export default defineConfig({
+  adapter: node({
+    mode: 'standalone',
+  }),
});
```

## 3. Animal API

`./src/api/animal.api.ts`

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

## 4. Use the API in the home page

`./src/index.astro`

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

`pnpm build` → static HTML in `dist/`.

## 5. Opt into SSR

`./src/index.astro`

```diff
---
+ export const prerender = false;
const dogImage = await getRandomDogImage();
const catImage = await getRandomCatImage();
---
```

Now `pnpm build` produces `dist/server/pages/_index.astro` — rendered per request.

## 6. Simulate a slow cat fetch

```diff
export async function getRandomCatImage(): Promise<string> {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data: { url: string }[] = await res.json();

+  // ⏳ Add a 5-second delay
+  await new Promise(resolve => setTimeout(resolve, 5000));

  return data[0].url;
}
```

Reload — the whole page waits 5s.

## 7. Split into components

`./src/components/dog.astro`

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

`./src/components/cat.astro`

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

`./src/index.astro`

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

Astro streams components asynchronously by default — dog shows up first.

## 8. Force deferred rendering with `server:defer`

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

## Summary

- SSG: HTML built once.
- SSR: HTML per request (`prerender = false`).
- Hybrid: mix both.
- Streaming: ships HTML in chunks.
- `server:defer`: defer a component so it doesn't block the initial response; supports a `fallback` slot.

---

## What's new in Astro 6

- **Server Islands stable**: `server:defer` is stable in Astro 6 (was experimental).
- **Queued Rendering (experimental)**: queue + prioritize Server Island rendering via experimental flag.
- **Route Caching (experimental)**: cache SSR route output for a configurable TTL via experimental flag.

---

## Resources

- [Astro: SSR and hybrid mode](https://docs.astro.build/en/guides/server-side-rendering/)
- [Astro: Server Islands (`server:defer`)](https://docs.astro.build/en/guides/server-islands/)
- [Astro 6 announcement](https://astro.build/blog/)
