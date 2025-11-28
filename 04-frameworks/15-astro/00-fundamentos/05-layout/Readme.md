# Layout (Diseño)

Hasta ahora hemos estado trabajando todo el tiempo en la página _index.astro_, pero la mayoría de los sitios web tienen múltiples páginas, y comparten algunos elementos comunes, como el **header** y el **footer**.

Así que si necesitamos añadir otra página, podemos simplemente crear un nuevo archivo en la carpeta `src/pages`, y le podemos dar un nombre tal que `about.astro`:

_./src/pages/about.astro_

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

Y hasta podríamos añadir un enlace de navegación en la página principal:

_./src/pages/index.astro_

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

Podemos probarlo:

```bash
npm run dev
```

Esto funciona, pero estamos repitiendo un montón de código.

Las etiquetas `<head>`, `<html>` y `<body>` son las mismas en ambas páginas, y además podríamos incluso tener un header o footer común.

Si empezamos a copiar y pegar, vamos a acabar con un proyecto complicado de mantener.

¿Qué podemos hacer al respecto?

Vamos a crear un **componente de layout** que envuelva nuestras páginas e incluya los elementos comunes.

Creamos una nueva carpeta en `src` llamada `layouts`, y dentro un nuevo archivo que nombraremos `BaseLayout.astro`.

> Usaremos _slots_ para definir donde irá el contenido de cada página, esto es similar a `props.children` en React.

_./src/layouts/BaseLayout.astro_

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

Y en la página principal, simplemente usamos el layout:

_./src/pages/index.astro_

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

Y en la página “about” hacemos lo mismo:

_./src/pages/about.astro_

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

Solo hay un problema:

El título de la página siempre es **“Astro”**. Podemos solucionarlo pasando una prop `title` al componente de layout.

_./src/layouts/BaseLayout.astro_

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

Ahora volvemos a cada página y actualizamos esa propiedad:

_./src/pages/index.astro_

```diff
- <BaseLayout>
+ <BaseLayout title="Home">
    <h1>Dog Facts</h1>
```

_./src/pages/about.astro_

```diff
-  <BaseLayout>
+  <BaseLayout title="About">
    <h1>Página About</h1>
```

Y así podemos ver que ambos títulos son correctos.

```bash
npm run dev
```

En el siguiente video vamos a ver como manejar colecciones de ficheros markdown en nuestro proyecto.
