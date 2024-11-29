# Layouts

Hasta ahora hemos estado repetiendo headers y footers en cada página, eso no es muy buena idea, ¿Os acordáis del concepto de layout que vimos en React? Pues en Astro tenemos cosas parecidas, vamos a verlas.

# Manos a la obra

Vamos a definir el layout base para nuestro sitio:

_./src/layouts/base.astro_

```astro
---
import Header from '../components/header.astro';
import Footer from '../components/footer.astro';
import '../styles/global.css';
const pageTitle = "Home Page";
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <Header />
    <h1>{pageTitle}</h1>
    <Footer />
    <script>
      import "../scripts/hamburger.ts";
    </script>
  </body>
</html>
```

Hasta aquí más o menos, pero entre el _header_ y el _footer_ tiene que ir el contenido. ¿Qué hacemos? En React tenemos la propiedad _children_ que nos permite hacer esto, en Astro tenemos algo parecido, se llama _slot_.

```diff
  <body>
    <Header />
    <h1>{pageTitle}</h1>
+   <slot />
    <Footer />
    <script>
      import "../scripts/hamburger.ts";
    </script>
  </body>
```

Vamos ahora a usarlo en la página principal:

_./src/pages/index.astro_

```diff
---
- import "../styles/global.css";
- import Header from "../components/header.astro";
- import Footer from "../components/footer.astro";
+ import BaseLayout from '../layouts/base.astro';
---

- <html lang="en">
-  <head>
-    <meta charset="utf-8" />
-    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-    <meta name="viewport" content="width=device-width" />
-    <meta name="generator" content={Astro.generator} />
-    <title>Mi Blog de Ejemplo</title>
-  </head>
-  <body>
-    <Header />
+ <BaseLayout>
-     <h1>Mi blog de Ejemplo 3</h1>
+     <p>contenido de la página</p>
+ </BaseLayout>
-     <Footer />
-    <script>
-      import "../scripts/hamburger.ts";
-    </script>
-  </body>
-</html>
```

Nos falta un detalle, para el _h1_ del layout base, lo suyo es poder pasarle el contenido por props, vamos a ello:

_./src/layouts/base.astro_

```diff
---
import Header from "../components/header.astro";
import Footer from "../components/footer.astro";
import "../styles/global.css";
- const pageTitle = "Home Page";
+ interface Props {
+   pageTitle: string;
+ }
+
+ const { pageTitle } = Astro.props as Props;
---

<html lang="en">
```

Y ahora en Index:

_./src/pages/index.astro_

```diff
---
import BaseLayout from "../layouts/base.astro";
---

<BaseLayout
+ pageTitle="Página principal"
>
  <p>Contenido de la página</p>
</BaseLayout>
```

Ahora podemos aplicar esto en las otras dos páginas:

_./src/pages/blog.astro_

```diff
---
- import "../styles/global.css";
- import Navigation from "../components/navigation.astro";
+ import BaseLayout from "../layouts/base.astro";
---
```

```diff
- <html lang="en">
-  <head>
-    <meta charset="utf-8" />
-    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-    <meta name="viewport" content="width=device-width" />
-    <meta name="generator" content={Astro.generator} />
-    <title>Acerca de</title>
-  </head>
-  <body>
-    <Navigation />
+ <BaseLayout pageTitle="Blog">
-    <h1>Blog</h1>
    <h2>Aqui va mi listado de posts</h2>
    <ul>
      <li><a href="/posts/post-1/">Post 1</a></li>
      <li><a href="/posts/post-2/">Post 2</a></li>
      <li><a href="/posts/post-3/">Post 3</a></li>
    </ul>
+ </BaseLayout>
  </body>
</html>
```

_./src/pages/about.astro_

```diff
---
- import "../styles/global.css";
+ import BaseLayout from "../layouts/base.astro";
import type { Identity } from "./about.model.ts";
- import Navigation from "../components/navigation.astro";
+ import BaseLayout from "../layouts/base.astro";

const pageTitle = "Acerca de dinámico";

const identity: Identity = {
  firstName: "Paquillo",
  country: "Argentina",
  occupation: "Programador",
  hobbies: ["fotografía", "beber cerveza", "futbol"],
};

const skills = ["HTML", "CSS", "JavaScript", "React", "Astro"];
const happy = true;
const finished = false;
const goal = 3;

const skillColor = "navy";
---
```

```diff
- <html lang="en">
-  <head>
-    <meta charset="utf-8" />
-    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
-    <meta name="viewport" content="width=device-width" />
-    <meta name="generator" content={Astro.generator} />
-    <title>{pageTitle}</title>
-    <style define:vars={{ skillColor }}>
-      h1 {
-        color: purple;
-        font-size: 4rem;
-      }
-      .skill {
-        color: var(--skillColor);
-        font-weight: bold;
-      }
-    </style>
-  </head>
-  <body>
-    <Navigation />
-
-    <h1>{pageTitle}</h1>
+ <BaseLayout pageTitle={pageTitle}>
    <h2>Y mi nuevo blog</h2>

    <p>Esta es la página de "acerca de".</p>

    <ul>
      <li>Me llamo {identity.firstName}.</li>
      <li>vivo en {identity.country} y trabajo com {identity.occupation}.</li>
      {
        identity.hobbies.length >= 2 && (
          <li>
            Dos de mis hobbies son: {identity.hobbies[0]} and{" "}
            {identity.hobbies[1]}
          </li>
        )
      }
    </ul>
    <p>Mis skills</p>
    <ul>
      {skills.map((skill) => <li class="skill">{skill}</li>)}
    </ul>
    {happy && <p>Estoy mu contento !</p>}

    {finished && <p>He completado este tutorial</p>}

    {
      goal === 3 ? (
        <p>Mi meta es completarlo en 3 días.</p>
      ) : (
        <p>Pues no llevo tres días.</p>
      )
    }
+ </BaseLayout>
```
