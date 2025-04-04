# Layout y markdown

Ya tenemos el layout definido en... casí todas las ventanas, nos queda cunado pinchamos en un post, aquí podríamos:

- Usar el componente `Markdown` de Astro y encastrarlo todo en un layout.
- Definir un layout para el markdown.

# Manos a la obra

Vamos a crear un layout para el markdown, para ello vamos a crear un nuevo archivo en `src/layouts` llamado `markdown-post.astro`:

Miramos que propiedades trae el frontmatter de cada post, ponemos cabecera y soltamos un `slot` para el markdown.

_./src/layouts/markdown-post.astro_

```astro
---
interface Frontmatter {
  layout: string;
  title: string;
  pubDate: string;
  description: string;
  author: string;
  image: {
    url: string;
    alt: string;
  };
  tags: string[];
}

const { frontmatter } = Astro.props as { frontmatter: Frontmatter };
---

<h1>{frontmatter.title}</h1>
<p> Written by {frontmatter.author}</p>
<slot />
```

Ya tenemos el layout, ahora vamos a decirle a cada post que lo use:

_./src/pages/posts/post-1.md_

```diff
---
+ layout: ../../layouts/markdown-post.astro
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
```

_./src/pages/posts/post-2.md_

```diff
---
+ layout: ../../layouts/markdown-post.astro
title: Mi segundo post
author: Lemoncoder
description: "Segundo post para el ejemplo"
image:
  url: "https://docs.astro.build/assets/arc.webp"
  alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2024-11-23
tags: ["astro", "blogging", "learning in public", "successes"]
---

- # Mi primer post

- Publicado el : 2024-11-20
```

_./src/pages/posts/post-3.md_

```diff
---
+ layout: ../../layouts/markdown-post.astro
title: Mi tercer post
author: Lemoncoder
description: "Tercer post para el ejemplo"
image:
url: "https://docs.astro.build/assets/arc.webp"
alt: "The Astro logo on a dark background with a purple gradient arc."
pubDate: 2024-11-25
tags: ["astro", "blogging", "learning in public", "successes"]
---
```

Y ahora podemos ver como cada post utiliza el layout.

Bueno, no esta mal, pero echamos de menos la estructura principal (la que definimos en el otro layout), ¿Qué podemos hacer? Componer layouts :).

Me voy a _markdown-post.astro_ utilizo el layout base.

_./src/layouts/markdown-post.astro_

```diff
---
+ import BaseLayout from "./base.astro";

interface Frontmatter {
  layout: string;
  title: string;
  pubDate: string;
  description: string;
  author: string;
  image: {
    url: string;
    alt: string;
  };
  tags: string[];
}

const { frontmatter } = Astro.props as { frontmatter: Frontmatter };
---

+ <BaseLayout pageTitle={frontmatter.title}>
-  <h1>{frontmatter.title}</h1>
  <p>Written by {frontmatter.author}</p>
  <slot />
+ </BaseLayout>
```
