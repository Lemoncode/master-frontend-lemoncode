# Componentes

Hasta ahora todo lo que hemos creado ha sido en un mismo fichero, y ya sabemos lo que pasa cuando una página crece... se vuelve un caos.

Vamos a ver como podemos definir componentes en _astro_

En concreto vamos a ver como crear:

- Una barra de navegación.
- Un footer.
- Un componente de redes sociales.
- Un menú de navegación

# Manos a la obra

Arrancamos por crear la carpeta `src/components`

Debajo de esta, vamos a crear un componente de navegación:

_./src/components/navigation.astro_

```astro
---
---
<a href="/">Home</a>
<a href="/about/">About</a>
<a href="/blog/">Blog</a>
```

Ahora podemos añadir el componente en, por ejemplo, nuestra página `index.astro` y reemplazar la barra harcodeada.

_./src/index.astro_

```diff
---
import '../styles/global.css';
+ import Navigation from '../components/navigation.astro';
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Mi Blog de Ejemplo</title>
	</head>
	<body>
-    <a href="/">Home</a>
-    <a href="/blog">Blog</a>
-    <a href="/about/">About</a>
+    <Navigation />

		<h1>Mi blog de Ejemplo 3</h1>
	</body>
</html>
```

Vamos a cambiarlo en la página de about

_./src/pages/about.astro_

```diff
---
import "../styles/global.css";
import type { Identity } from "./about.model.ts";
+ import Navigation from "../components/navigation.astro";

const pageTitle = "Acerca de dinámico";
```

```diff
  <body>
+    <Navigation />
-    <a href="/">Home</a>
-    <a href="/blog">Blog</a>
-    <a href="/about/">About</a>

    <h1>{pageTitle}</h1>
    <h2>Y mi nuevo blog</h2>
```

Y en la de blog

_./src/pages/blog.astro_

```diff
---
import "../styles/global.css";
+ import Navigation from "../components/navigation.astro";
---
```

```diff
  <body>
+    <Navigation />
-    <a href="/">Home</a>
-    <a href="/blog/">Blog</a>
-    <a href="/about/">About</a>

    <h1>Blog</h1>
```

Vamos a crear un footer:

_./src/components/footer.astro_

```astro
---
const platform = "github";
const username = "lemoncode";
---

<footer>
  <p>Más proyectos: <a href={`https://www.${platform}.com/${username}`}>{platform}</a>!</p>
</footer>
```

Vamos a importarlo y cambiarlo en la ventana principal

_./src/index.astro_

````diff
---
import "../styles/global.css";
import Navigation from "../components/navigation.astro";
+ import Footer from "../components/footer.astro";
---

```diff
  <body>
    <Navigation />

    <h1>Mi blog de Ejemplo 3</h1>
+   <Footer />
  </body>
</html>
````

Vamos ahora a crear un componente de social media, esta vez va a aceptar `Props` (si, al estilo de React).

_./src/components/social.astro_

```astro
---
interface Props {
  platform: string;
  username: string;
}

const { platform, username } = Astro.props as Props;
---

<a href={`https://www.${platform}.com/${username}`}>{platform}</a>
```

Y vamos a darle uso en el componente de footer

_./src/components/footer.astro_

```diff
---
- const platform = "github";
- const username = "lemoncode";
+ import Social from './social.astro';
---

<footer>
-  <p>Más proyectos: <a href={`https://www.${platform}.com/${username}`}>{platform}</a>!</p>
+  <Social platform="twitter" username="lemoncoders" />
+  <Social platform="github" username="lemoncode" />
+  <Social platform="youtube" username="lemoncoders" />
</footer>
```

Ahí lo tenemos, aunque se ve un poco feo, vamos a darle un poco de estilo.

_./src/components/social.astro_

```diff
---
interface Props {
  platform: string;
  username: string;
}

const { platform, username } = Astro.props as Props;
---

<a href={`https://www.${platform}.com/${username}`}>{platform}</a>

+ <style>
+  a {
+    padding: 0.5rem 1rem;
+    color: white;
+    background-color: #4c1d95;
+    text-decoration: none;
+  }
+ </style>
```

Y también en el footer le metemos un `flex container`.

_./src/components/footer.astro_

```diff
---
import Social from "./social.astro";
---

<footer>
  <Social platform="twitter" username="lemoncoders" />
  <Social platform="github" username="lemoncode" />
  <Social platform="youtube" username="lemoncoders" />
</footer>

+ <style>
+  footer {
+    display: flex;
+    gap: 1rem;
+    margin-top: 2rem;
+  }
+ </style>
```

Vamos a terminar por construir un menú de navegación responsive.

En el componente de navegación vamos a usar una clase de CSS que después definiremos a nivel global.

_./src/components/navigation.astro_

```diff
---
---
+ <div class="nav-links">
  <a href="/">Home</a>
  <a href="/about/">About</a>
  <a href="/blog/">Blog</a>
+ </div>
```

Y en global CSS vamos a copiar estos estilos:

_./src/styles/global.css_

```diff
html {
  background-color: #f1f5f9;
  font-family: sans-serif;
}

body {
  margin: 0 auto;
  width: 100%;
  max-width: 80ch;
  padding: 1rem;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

h1 {
  margin: 1rem 0;
  font-size: 2.5rem;
}

/* nav styles */

+ .nav-links {
+  width: 100%;
+  top: 5rem;
+  left: 48px;
+  background-color: #ff9776;
+  display: none;
+  margin: 0;
+ }
+
+ .nav-links a {
+  display: block;
+  text-align: center;
+  padding: 10px 0;
+  text-decoration: none;
+  font-size: 1.2rem;
+  font-weight: bold;
+  text-transform: uppercase;
+ }
+
+ .nav-links a:hover,
+ .nav-links a:focus {
+  background-color: #ff9776;
+ }
+
+ .expanded {
+  display: unset;
+ }
+
+ @media screen and (min-width: 636px) {
+  .nav-links {
+    margin-left: 5em;
+    display: block;
+    position: static;
+    width: auto;
+    background: none;
+  }
+
+  .nav-links a {
+    display: inline-block;
+    padding: 15px 20px;
+  }
+
+ }
```
