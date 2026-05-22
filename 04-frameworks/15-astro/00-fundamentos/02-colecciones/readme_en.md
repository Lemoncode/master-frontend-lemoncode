# Collections

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

## 1. Fetch a list (5 dog images instead of 1)

`./src/pages/index.astro`

```diff
---
const title = "Hello world !";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
- const res = await fetch("https://dog.ceo/api/breeds/image/random");
+ const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
  const response = await res.json();
- const dogImageUrl = response?.message ?? imageError;
+ const dogImageUrls = response?.message ?? [imageError];
---
```

## 2. Map URLs to `<img>` elements

```diff
  <body>
    <h1>{title}</h1>
-    <img
-      src={dogImageUrl}
-      alt="Random Dog"
-      style="max-width: 400px; height: auto;"
-    />
+    <div>
+      {dogImageUrls.map((dogImageUrl : string) => (
+        <img
+          src={dogImageUrl}
+          alt="Random Dog"
+          style="max-width: 200px; height: auto; margin: 10px;"
+        />
+      ))}
+    </div>
    <div>
      <button id="cat-image-button">Get Cat Image</button>
    </div>
    <div>
      <img id="cat-image" style="max-width: 400px; height: auto;" />
    </div>
  </body>
```

```bash
pnpm dev
```

## 3. Verify build output

```bash
pnpm build
```

The five images are baked into the generated HTML.

---

## Resources

- [Astro: Templates and JSX-like expressions](https://docs.astro.build/en/basics/astro-syntax/#jsx-like-expressions)
