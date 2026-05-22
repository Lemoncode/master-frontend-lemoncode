# About Mini Card (HCMS integration)

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Integrate **Content Island** (a Headless CMS) to drive the author's mini-bio.

## 1. Install the Content Island client

```bash
pnpm add @content-island/api-client
```

## 2. Add the secret token

`.env`

```
CONTENT_ISLAND_SECRET_TOKEN=98bfcafff2e649ed1fccec36abde3379
```

`./astro.config.mjs`

```diff
- import { defineConfig } from 'astro/config';
+ import { defineConfig, envField } from "astro/config";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
+  env: {
+    schema: {
+      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
+        context: "server",
+        access: "secret",
+        optional: false,
+        default: "INFORM_VALID_TOKEN",
+      }),
+    },
+  },
});
```

```bash
pnpm build
```

(Generates the type definitions for `astro:env/server`.)

## 3. Create the API client

`./src/lib/client.ts`

```ts
import { createClient } from '@content-island/api-client';
import { CONTENT_ISLAND_SECRET_TOKEN } from 'astro:env/server';

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN,
});

export default client;
```

## 4. Define the MiniBio model

`./src/pods/mini-bio/mini-bio.model.ts`

```diff
export type MiniBioType = 'hero' | 'card';

+ import type { Media } from "@content-island/api-client";
+
+ export interface MiniBio {
+  id: string;
+  language: "en";
+  title: string;
+  name: string;
+  role: string;
+  description: string;
+  image: Media;
+  imageAlt: string;
+ }
```

## 5. Fetch the data

`./src/pods/mini-bio/mini-bio.api.ts`

```ts
import client from '#lib/client';
import type { MiniBio } from './mini-bio.model';

export const getMiniBio = async () =>
  await client.getContent<MiniBio>({
    contentType: 'MiniBio',
  });
```

## 6. Wire it in the pod

`./src/pods/mini-bio/mini-bio.pod.astro`

```diff
---
+ import { getMiniBio } from './mini-bio.api';
import MiniBioHero from './components/mini-bio-hero.astro';
import MiniBioCard from './components/mini-bio-card.astro';
import type { MiniBioType } from './mini-bio.model';

interface Props {
  type: MiniBioType;
}

const { type } = Astro.props;

+ const miniBio = await getMiniBio();
---

- {type === 'hero' ? <MiniBioHero /> : <MiniBioCard />}
+ {type === 'hero' ? <MiniBioHero /> : <MiniBioCard content={miniBio} />}
```

## 7. MiniBioCard — accept the prop

`./src/pods/mini-bio/components/mini-bio-card.astro`

```diff
---
import ShapeOval from '#assets/shapes/oval.svg';
import ShapeRectangle from '#assets/shapes/rectangle.svg';
+ import type { MiniBio } from '../mini-bio.model';

+ interface Props {
+  content: MiniBio;
+ }
+ const { content } = Astro.props;
---
```

Quick sanity check:

```diff
<section
  class="bg-primary-50 dark:bg-primary-100 relative hidden overflow-clip rounded-2xl p-6 lg:block"
  aria-labelledby="about-me-aside-heading"
>
+  <div class="relative z-10 flex flex-col items-center justify-center gap-6">
+    <h2 class="font-geist w-full font-bold" id="about-me-aside-heading">{content.title}</h2>
+  </div>
```

```bash
pnpm dev
```

## 8. Full MiniBioCard markup

`./src/pods/mini-bio/components/mini-bio-card.astro`

```diff
---
+ import ContactButtons from '#components/contact-buttons.astro';
---

  <div class="relative z-10 flex flex-col items-center justify-center gap-6">
    <h2 class="font-geist w-full font-bold" id="about-me-aside-heading">{content.title}</h2>

+    <div class="flex flex-col items-center justify-center gap-2 text-center">
+      <div class="h-24 w-24">
+        <img
+          alt={content.imageAlt}
+          class="block h-full w-full rounded-full object-cover"
+          height="80"
+          src={content.image.url}
+          width="80"
+        />
+      </div>
+
+      <span class="text-tbase-500/90 font-bold">{content.name}</span>
+      <span class="text-primary-500 font-semibold">{content.role}</span>
+      <p class="text-sm">
+        {content.description}
+      </p>
+    </div>
+
+    <ContactButtons />
  </div>
```

## 9. MiniBioHero — same pattern

`./src/pods/mini-bio/mini-bio.pod.astro`

```diff
- {type === 'hero' ? <MiniBioHero /> : <MiniBioCard content={miniBio} />}
+ {type === 'hero' ? <MiniBioHero content={miniBio} /> : <MiniBioCard content={miniBio} />}
```

`./src/pods/mini-bio/components/mini-bio-hero.astro`

```diff
---
import Hero from '#components/hero.astro';
+ import type { MiniBio } from '../mini-bio.model';

+ interface Props {
+  content: MiniBio;
+ }
+ const { content } = Astro.props;
---

- <Hero ariaLabelledby="about-hero-heading" />
+ <Hero ariaLabelledby="about-hero-heading">
+  <div class="flex flex-col justify-center gap-6 md:flex-row md:gap-10">
+    <div class="h-[120px] w-[120px] md:h-[240px] md:w-[240px]">
+      <img src={content.image.url} alt={content.imageAlt} class="h-full w-full rounded-full object-cover" />
+    </div>
+    <div class="flex max-w-[55ch] flex-1 flex-col justify-center gap-4">
+      <div>
+        <h1 class="text-primary-700 text-5xl font-bold" id="about-hero-heading">{content.name}</h1>
+        <p class="text-primary-500 font-semibold">{content.role}</p>
+      </div>
+      <p>
+        {content.description}
+      </p>
+    </div>
+  </div>
+ </Hero>
```

```bash
pnpm dev
```

---

## What's new in Astro 6

- **`astro:env` stable**: `envField.string({ context: "server", access: "secret", ... })` is stable (was experimental in Astro 4). Types are generated for `astro:env/server`.
- **Clear errors if `.env` is missing**: with `optional: false`, build fails fast instead of breaking at runtime.

---

## Resources

- [Astro: Environment variables (`astro:env`)](https://docs.astro.build/en/guides/environment-variables/)
- [Content Island — Docs](https://docs.contentisland.net/)
