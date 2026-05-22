# Components

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

## 1. Props refresher

Props are passed parent → child via attributes, typed with a `Props` interface and read from `Astro.props`:

```astro
---
interface Props {
  name: string;
}
const { name } = Astro.props;
---

<p>Hello, {name}!</p>
```

```astro
<MyComponent name="Manolo" />
```

## 2. Create the `DogPics` component

`./src/components/DogPics.astro`

```astro
---
interface Props {
  urls: string[];
}
const { urls } = Astro.props;
---

<div>
  {
    urls.map((url: string) => (
      <img src={url} alt="Random Dog" style="max-width:200px;height:auto;" />
    ))
  }
</div>
```

## 3. Use it in `index.astro`

`./src/pages/index.astro`

```diff
---
+ import DogPics from '../components/DogPics.astro';
const title = "Hola world !!";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
const response = await res.json();
const dogImageUrls = response?.message ?? [imageError];
---
```

```diff
  <body>
    <h1>{title}</h1>
-    <div>
-      {
-        dogImageUrls.map((url: string) => (
-          <img
-            src={url}
-            alt="Random Dog"
-            style="max-width:200px;height:auto;"
-          />
-        ))
-      }
-    </div>
+    <DogPics urls={dogImageUrls} />
    <div>
			<button id="cat-image-button">Get Cat Image</button>
		</div>
		<div>
			<img id="cat-image" style="max-width: 400px; height: auto;"/>
		</div>
  </body>
```

> Props run once on the server. For interactive components, use **Islands** (covered later).

---

## Resources

- [Astro: Components](https://docs.astro.build/en/basics/astro-components/)
- [Astro: Islands architecture](https://docs.astro.build/en/concepts/islands/)
