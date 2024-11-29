# Astro API

Vamos a ver como podemos hacer para poder leer listas de ficheros en nuestro proyecto Astro.

En concreto, vamos a leer la lista de posts que tenemos y mostrarla en una página de listado de posts.

# Manos a la obra

Tenemos una página con un listado de posts `blog.astro`, vamos a leer los posts de la lista de markdowns que tenemos y mostrarlos.

_./src/pages/blog.astro_

```diff
---
import BaseLayout from "../layouts/base.astro";

+ // This could be moved to common model and share it with the
+ // blog layout
+ interface Frontmatter {
+   layout: string;
+  title: string;
+  pubDate: string;
+  description: string;
+  author: string;
+  image: {
+    url: string;
+    alt: string;
+  };
+  tags: string[];
+ }

+ const allPosts = await Astro.glob<Frontmatter>("./posts/*.md");
---

<BaseLayout pageTitle="Blog">
  <h2>Aqui va mi listado de posts</h2>
  <ul>
    <li><a href="/posts/post-1/">Post 1</a></li>
    <li><a href="/posts/post-2/">Post 2</a></li>
    <li><a href="/posts/post-3/">Post 3</a></li>
  </ul>
</BaseLayout>
```

Y mostramos todos los posts que tenemos en la lista:

_./src/pages/blog.astro_

```diff

<BaseLayout pageTitle="Blog">
  <h2>Aqui va mi listado de posts</h2>
  <ul>
-    <li><a href="/posts/post-1/">Post 1</a></li>
-    <li><a href="/posts/post-2/">Post 2</a></li>
-    <li><a href="/posts/post-3/">Post 3</a></li>
+    {allPosts.map((post) => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}
  </ul>
</BaseLayout>
```

Para ver que esto funciona, vamos a crear un cuarto post:

_./src/pages/posts/post-4.md_

```md
---
layout: ../../layouts/markdown-post.astro
title: Cuarto post
author: Lemoncode
description: "Este post lo creamos y se muestra del tirón"
image:
  url: "https://docs.astro.build/default-og-image.png"
  alt: "The word astro against an illustration of planets and stars."
pubDate: 2022-08-08
tags: ["astro", "successes"]
---

Este es el cuarto post, si tenemos el proyecto arrancado, se regenerará y mostrará este cuarto post
```

Y ahora podrás pensar, oye es que quiero mostrarlo ordenado por fecha, pues, lo tienes fácil, la lista la tienes tipada junto con sus campos del front matter y podrías hacer un sort por el campo fecha.
