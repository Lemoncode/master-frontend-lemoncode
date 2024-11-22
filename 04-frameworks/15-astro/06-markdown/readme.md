# Markdown

Una característica muy interesante que trae Astro es lo fácil que es integrar contenido Markdown en nuestros archivos `.astro`.

Vamos a generar un fichero markdown en la ruta _./src/pages/posts/post-1.md_

```markdown
---
title: "Mi primer post"
pubDate: 2024-11-20
description: "Mi primer post"
author: "Lemoncoder"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "The Astro logo on a dark background with a pink glow."
tags: ["astro", "blogging", "hola mundo"]
---

# Mi primer post

Publicado el : 2024-11-20

Bienvenido a mi _nuevo blog_ sobre Astro! Aquí, compartiré mi viaje de aprendizaje mientras construyo un nuevo sitio web.

## Hasta donde he llegado

1. **Instalando Astro**: Primero, creé un nuevo proyecto Astro y configuré mis cuentas en línea.

2. **Creando Páginas**: Luego, aprendí a crear páginas creando nuevos archivos `.astro` y colocándolos en la carpeta `src/pages/`.

3. **Creando Posts de Blog**: ¡Este es mi primer post! ¡Ahora tengo páginas Astro y posts en Markdown!

## Próximos pasos

Completar el tutorial de astro y seguir añadiendo posts.
```

Fijate que curioso, podemos arrancar el servidor:

```bash
npm run dev
```

Y navegar a la ruta _http://localhost:4321/posts/post-1_ para ver nuestro post en markdown.

Fijate que automáticamente `Astro` ha convertido nuestro archivo markdown en una página HTML.

> La información en la parte superior del archivo, que aparece como entre rejas, se llama frontmatter. Estos datos, que incluyen etiquetas (tags) y una imagen para la publicación, son información sobre tu publicación que Astro puede utilizar. No aparece automáticamente en la página, pero más adelante en el tutorial la usarás para mejorar tu sitio.

Vamos a añadir un enlace al post en la página de posts:

_./src/pages/blog.astro_

```diff
    <h1>Blog</h1>
    <h2>Aqui va mi listado de posts</h2>
+    <ul>
+      <li><a href="/posts/post-1/">Post 1</a></li>
+    </ul>
    </body>
```

Vamos a añadir dos posts más de prueba en markdown:

_./src/pages/posts/post-2.md_

```markdown
---
title: Mi Segundo Post
author: Lemoncoder
description: "Segundo post para el ejemplo"
image:
  url: "https://docs.astro.build/assets/arc.webp"
  alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2024-11-23
tags: ["astro", "blogging", "learning in public", "successes"]
---

Ahí vamos, ya tenemos un segundo post aqui.
```

_./src/pages/posts/post-3.md_

```markdown
---
title: Mi tercer Post
author: Lemoncoder
description: "Tercer post para el ejemplo"
image:
url: "https://docs.astro.build/assets/arc.webp"
alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2024-11-25
tags: ["astro", "blogging", "learning in public", "successes"]
---

Ahí vamos, ya tenemos un tecer post aqui.
```

Y los añadimos a la lista de posts:

_./src/pages/blog.astro_

```diff
    <ul>
      <li><a href="/posts/post-1/">Post 1</a></li>
+      <li><a href="/posts/post-2/">Post 2</a></li>
+      <li><a href="/posts/post-3/">Post 3</a></li>
    </ul>
```

Ahora podemos navegar a los 3 posts.
