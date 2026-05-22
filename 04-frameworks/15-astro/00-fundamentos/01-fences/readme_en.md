# Fences

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Start from the previous demo **00-creando-proyecto**. Copy it to a clean folder, then `pnpm install` and `pnpm dev`.

## 1. Bind a variable in the template

`./src/pages/index.astro`

```diff
---
+ const title = "Hello world !!";
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
-		<h1>Astro</h1>
+    <h1>{title}</h1>
```

```bash
pnpm dev
```

## 2. Fetch from a fence (runs on server / build)

`./src/pages/index.astro`

```diff
---
const title = "Hello world !!";
+ const imageError = "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
+ const res = await fetch("https://dog.ceo/api/breeds/image/random");
+ const response = await res.json();
+ const dogImageUrl = response?.message ?? imageError;
---
```

```diff
	<body>
     <h1>{title}</h1>
+    <img src={dogImageUrl} alt="Random Dog" style="max-width: 400px; height: auto;"/>
```

Run a build and inspect `./dist/index.html` — the dog URL is baked in.

```bash
pnpm build
```

## 3. Add a client-side script

`./src/pages/index.astro`

```diff
		<h1>{title}</h1>
		<img src={dogImageUrl} alt="Random Dog" />
+  <div>
+		  <button id="cat-image-button">Get Cat Image</button>
+  </div>
+  <div>
+		  <img id="cat-image" style="max-width: 400px; height: auto;"/>
+   </div>
	</body>
</html>

+ <script>
+ const button = document.getElementById("cat-image-button");
+ const imageEl = document.getElementById("cat-image") as HTMLImageElement;
+
+ if (button && imageEl) {
+  button.addEventListener("click", async () => {
+    const res = await fetch("https://api.thecatapi.com/v1/images/search");
+    const data = await res.json();
+    imageEl.src = data[0].url;
+  });
+}
+ </script>
```

```bash
pnpm dev
```

## 4. Debugging

- **Fence code**: set a breakpoint, open a **JavaScript Debug Terminal** in VS Code, run `pnpm dev`.
- **Browser code**: DevTools as usual.

## 5. Bonus — extract the client script to a `.ts` file

`./src/pages/cat.ts`

```ts
const getCatImage = async () => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await res.json();
  return data[0].url;
};

export const setupCatFactButton = () => {
  const button = document.getElementById("cat-image-button");
  const imageEl = document.getElementById("cat-image") as HTMLImageElement;

  if (button && imageEl) {
    button.addEventListener("click", async () => {
      const fact = await getCatImage();
      imageEl.src = fact;
    });
  }
};
```

`./src/pages/index.astro`

```diff
<script>
+ import { setupCatFactButton } from "./cat";
+ setupCatFactButton();
- const button = document.getElementById("cat-image-button");
- const imageEl = document.getElementById("cat-image") as HTMLImageElement;
-
- if (button && imageEl) {
-  button.addEventListener("click", async () => {
-    const res = await fetch("https://api.thecatapi.com/v1/images/search");
-    const data = await res.json();
-    imageEl.src = data[0].url;
-  });
-}
</script>
```

---

## What's new in Astro 6

- **Vite 7 integrated**: faster dev server, snappier hot-reload when editing fences or `<script>` blocks.

---

## Resources

- [Astro: Component syntax (fences)](https://docs.astro.build/en/basics/astro-syntax/)
- [Astro: Client-side `<script>`](https://docs.astro.build/en/guides/client-side-scripts/)
