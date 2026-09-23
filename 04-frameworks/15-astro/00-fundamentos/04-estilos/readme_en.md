# Styles

> Node.js 24.15 LTS + pnpm required. See [SETUP-PNPM.md](../../SETUP-PNPM.md).

Astro supports global CSS, component-scoped CSS, and Tailwind via a plugin.

## 1. Global stylesheet

`./src/styles.css`

```css
/* Light reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  background-color: #f9f9f9;
  padding: 16px 32px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: bold;
  color: #222;
  margin-bottom: 0.5em;
}

p { margin-bottom: 1em; }

a { color: #007bff; text-decoration: none; }
a:hover { text-decoration: underline; }

button {
  cursor: pointer;
  padding: 0.5em 1em;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  transition: background-color 0.3s;
}
button:hover { background-color: #0056b3; }

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}
```

## 2. Import the global CSS

`./src/pages/index.astro`

```diff
---
+ import "../styles.css";
import DogPics from "../components/DogPics.astro";
const title = "Hello World !";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
const response = await res.json();
const dogImageUrls = response?.message ?? [imageError];
---
```

## 3. Scoped styles inside `DogPics`

`./src/components/DogPics.astro` — append:

```css
<style>
  section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    background: #fff;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    display: block;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
</style>
```

## 4. Update the markup

`./src/components/DogPics.astro`

```diff
---
interface Props {
  urls: string[];
}
const { urls } = Astro.props;
---

- <div>
+ <section aria-label="Dog gallery">
  {urls.map((dogImageUrl: string) =>
+  <div class="card">
      <img
          src={dogImageUrl}
          alt="Random Dog"
-          style="max-width:200px;height:auto;"
        />
+  </div>
  )}
+ </section>
- </div>
```

```bash
pnpm dev
```

Open DevTools — these styles only affect this component.

---

## Resources

- [Astro: Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Astro + Tailwind](https://docs.astro.build/en/guides/styling/#tailwind)
