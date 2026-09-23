# Creando la estructura de carpetas

En nuestro sitio web queremos tener las siguientes páginas:

- Home: va a tener un listado de posts.
- About: va a tener información sobre el autor.
- Post: Tendrá info sobre un post en concreto.

De momento nos centramos en Home y About.

## Home

Para la página home vamos a usar el index principal que hay debajo de pages: _./src/pages/index.astro_

## About

La de about vamos a crear una subcarpeta (más adelante habrán más ficheros relacionados)

_./src/pages/about/index.astro_

```astro
---
import Layout from "../../layouts/Layout.astro";
---

<Layout>
  <h1>About</h1>
</Layout>
```

Ya que estamos, vamos a añadir una hoja de estilo global:

- Definimos unas variables de color y tipografía.
- Definimos unos estilos de base.

Si estás montando el ejemplo desde cero puedes copiarlo del enlace de Github:

_./src/styles/global.css_

```css
:root {
  --primary-color: #1d3353;
  --secondary-color: #fff;
  --border-color: #333;
  --pure-white: #fff;

  /*text colors*/
  --text-color: #333;
  --text-color-light: #fff;

  /*title hover color*/
  --title-hover-color: #033378;

  /*font family*/
  --ff-title: "IBM Plex Sans Condensed", sans-serif;
  --ff-body: "IBM Plex Sans", sans-serif;

  /*font sizes*/
  --fs-2xs: clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem);
  --fs-xs: clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem);
  --fs-sm: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
  --fs-md: clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem);
  --fs-lg: clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem);
  --fs-xl: clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem);
  --fs-2xl: clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem);
  --fs-3xl: clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem);
  --fs-4xl: clamp(3.3592rem, 2.8691rem + 2.4507vw, 4.7684rem);

  /*spacing*/
  --space-3xs: clamp(0.25rem, 0.5vw, 0.5rem);
  --space-2xs: clamp(0.5rem, 1vw, 1rem);
  --space-xs: clamp(1rem, 2vw, 1.5rem);
  --space-sm: clamp(1.5rem, 3vw, 2rem);
  --space-md: clamp(2rem, 4vw, 3rem);
  --space-lg: clamp(3rem, 6vw, 4rem);
  --space-xl: clamp(4rem, 8vw, 6rem);
  --space-2xl: clamp(6rem, 10vw, 8rem);

  /*border radius*/
  --border-radius: 6px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--ff-body);
  font-size: var(--fs-sm);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: var(--text-color);
}

main {
  flex: 1;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
  position: relative;
}
```

Vamos a crear un header para tener el menú de nuestro blog

_./src/components/Header.astro_

```astro
<header class="header">
  <nav class="menu">
    <ul>
      <li>
        <a href="/" class="menu__item"> CurioVerso</a>
      </li>
      <div class="menu__right">
        <li><a href="/" class="menu__item">All Post</a></li>
        <li><a href="/about/" class="menu__item">About</a></li>
      </div>
    </ul>
  </nav>
</header>

<style>
  .header {
    background-color: var(--primary-color);
    color: var(--text-color-light);
    padding: var(--fs-xs);
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  nav ul {
    display: flex;
    justify-content: space-between;
    list-style: none;
  }

  .menu__item {
    color: var(--text-color-light);
    text-decoration: none;
  }
  .menu__item:hover {
    color: var(--secondary-color);
  }

  .menu__item.active {
    color: var(--secondary-color);
  }

  .menu__right {
    display: flex;
    gap: var(--space-md);
  }
</style>
```

Y un footer:

_./src/components/Footer.astro_

```astro
<footer class="footer">
  <p>&copy; 2025</p>
</footer>

<style>
  .footer {
    background-color: var(--text-color);
    color: var(--text-color-light);
    padding: var(--fs-xs);
    text-align: center;
  }
</style>
```

Y vamos a modificar el layout principal para que cargue la hoja de estilo y también añadimos un menú (sustituimos el contenido por completo)

_./src/layouts/Layout.astro_

```diff
+ ---
+ import "../styles/global.css";
+ import Footer from "../components/Footer.astro";
+ import Header from "../components/Header.astro";
+ ---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro Basics</title>
+    <link rel="preconnect" href="https://fonts.googleapis.com" />
+    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
+    <link
+      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap"
+      rel="stylesheet"
+    />
+    <link
+      rel="stylesheet"
+     href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css"
+    />
  </head>
  <body>
+    <Header />
+    <main>
      <slot />
+    </main>
+    <Footer />
  </body>
</html>

<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

Ahora si arrancamos el proyecto con `npm run dev` vemos la páigna principal y podemos navegar a la de about desde el menú.
