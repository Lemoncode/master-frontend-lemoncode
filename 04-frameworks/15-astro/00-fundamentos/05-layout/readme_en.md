# Layout

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

## 1. Add a second page

`./src/pages/about.astro`

```astro
---
import "../styles.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>About Page</h1>
    <a href="/">Back Home</a>
  </body>
</html>
```

`./src/pages/index.astro`

```diff
  <body>
    <h1>{title}</h1>
    <DogPics urls={dogImageUrls} />

    <div>
      <button id="cat-image-button">Get Cat Image</button>
    </div>
    <div>
      <img id="cat-image" style="max-width: 400px; height: auto;" />
    </div>
+   <a href="/about">Go to about page</a>
  </body>
```

```bash
pnpm dev
```

## 2. Create a `BaseLayout`

`./src/layouts/BaseLayout.astro`

```astro
---
import "../styles.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## 3. Use it in `index.astro`

`./src/pages/index.astro`

```diff
---
- import "../styles.css";
+ import BaseLayout from "../layouts/BaseLayout.astro";
import DogPics from "../components/DogPics.astro";
const title = "Hello World !";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
const response = await res.json();
const dogImageUrls = response?.message ?? [imageError];
---

- <html lang="en">
-  <head>
-    <meta charset="utf-8" />
-    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-    <meta name="viewport" content="width=device-width" />
-    <meta name="generator" content={Astro.generator} />
-    <title>Astro</title>
-  </head>
-  <body>
+ <BaseLayout>
    <h1>{title}</h1>
    <DogPics urls={dogImageUrls} />

    <div>
      <button id="cat-image-button">Get Cat Image</button>
    </div>
    <div>
      <img id="cat-image" style="max-width: 400px; height: auto;" />
    </div>
    <a href="/about">Go to about page</a>
+  </BaseLayout>
- </html>

<script>
  import { setupCatFactButton } from "./cat";
  setupCatFactButton();
</script>
```

## 4. Same for `about.astro`

```diff
---
- import "../styles.css";
+ import BaseLayout from "../layouts/BaseLayout.astro";
---
-
- <html lang="en">
-  <head>
-    <meta charset="utf-8" />
-    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-    <meta name="viewport" content="width=device-width" />
-    <meta name="generator" content={Astro.generator} />
-    <title>Astro</title>
-  </head>
-  <body>
+  <BaseLayout>
    <h1>About Page</h1>
    <a href="/">Back Home</a>
+  </BaseLayout>
-  </body>
- </html>
```

## 5. Pass a `title` prop

`./src/layouts/BaseLayout.astro`

```diff
---
import "../styles.css";
+
+ export interface Props {
+   title: string;
+ }
+ const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
-    <title>Astro</title>
+    <title>{title}</title>
  </head>
```

`./src/pages/index.astro`

```diff
- <BaseLayout>
+ <BaseLayout title="Home">
    <h1>Dog Facts</h1>
```

`./src/pages/about.astro`

```diff
-  <BaseLayout>
+  <BaseLayout title="About">
    <h1>About Page</h1>
```

```bash
pnpm dev
```

---

## 6. Web fonts in the layout — classic vs Astro 6

### Classic: `<link>` to Google Fonts

`./src/layouts/BaseLayout.astro`

```astro
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>
```

```css
body { font-family: "Roboto", sans-serif; }
```

### Modern: Astro 6 Fonts API

**1. Declare the font in `astro.config.mjs`:**

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Roboto",
      cssVariable: "--font-roboto",
    },
  ],
});
```

**2. Use `<Font>` and the CSS variable:**

`./src/layouts/BaseLayout.astro`

```astro
---
import { Font } from "astro:assets";
---

<html lang="en">
  <head>
    <Font cssVariable="--font-roboto" preload />
  </head>
  <body>
    <slot />
  </body>
</html>

<style>
  body { font-family: var(--font-roboto); }
</style>
```

### Why the Fonts API is better

|                          | Classic `<link>`               | Astro 6 Fonts API                |
| ------------------------ | ------------------------------ | -------------------------------- |
| Font served from         | Google CDN (external)          | Your own domain                  |
| Privacy                  | Google sees user IP            | No external requests             |
| Extra DNS lookup         | Yes                            | No                               |
| Automatic preload        | Manual                         | With `preload` attribute         |
| Typing / autocomplete    | No                             | Yes (TypeScript)                 |
| Build-time optimization  | No                             | Yes (only used weights)          |

---

## Resources

- [Astro: Layouts](https://docs.astro.build/en/basics/layouts/)
- [Astro: Slots](https://docs.astro.build/en/basics/astro-components/#slots)
- [Astro Fonts API](https://docs.astro.build/en/guides/fonts/)
