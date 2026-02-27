# 03 Detalle de Publicación

Toca mostrar el contenido de un post.

Si ahora intentamos navegar a la página de detalle de una publicación específica, obtenemos un error 404.

Aquí nos encontramos con un escenario parecido al que tuvimos cuando gestionamos colecciones de markdown con Astro, si estamos en modo SSG, no nos vale generar una página tal cual como esta:

_./src/pages/posts/index.astro_

```astro
<h1>Hey I'm the post detail</h1>
```

Necesitamos una ruta por publicación. En Content Island tenemos un campo llamado `slug` que podemos usar para crear una ruta dinámica y vincular cada publicación con ella.

Entonces, ¿qué podemos hacer? Usar la funcionalidad que ofrece Astro para generar rutas dinámicas usando parámetros entre corchetes:

- Puedes agregar uno o más segmentos al nombre del archivo usando corchetes para indicar un segmento dinámico.
- El nombre dentro de los corchetes se convierte en la propiedad que puedes usar para acceder al valor de ese segmento.
- Con _getStaticPaths_, puedes decirle a Astro qué páginas generar en tiempo de compilación.

Así que renombramos el archivo de _index.astro_ a:

_./src/pages/posts/[slug].astro_

Y ahora calculamos todas las rutas que necesitamos generar usando _getStaticPaths_.

Para hacer esto, necesitamos:

- Obtener la lista de posts desde Content Island.
- Para cada publicación, devolver un objeto con una propiedad `params` que contenga el slug del post.
- Luego usar las props para renderizar el detalle del post.

Ya tenemos una API y un modelo disponibles en el pod de `post-collection`. En este punto podríamos:

1. Reutilizar esa API y modelo de ese pod.
2. Copiar la API y el modelo dentro de un nuevo pod.
3. Promoverlos a código compartido para reutilizarlos.

Por simplicidad, reutilizamos la API y el modelo directamente de post-collection.

_./src/pages/posts/[slug].astro_

```astro
---
import Layout from '#layouts/layout.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';

// Generate all possible paths
export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

// Per path let's generate the page
const { entry } = Astro.props;
---
```

¿Esto funcionará? Vamos a meter un código mínimo para ver que el detalle de la publicación se está cargando correctamente.

_./src/pages/posts/[slug].astro_

```diff
---
- <h1>Hey I'm the post detail</h1>
+ <Layout title={entry.title}>
+  <h2>{entry.title}</h2>
+ </Layout>
```

Le damos caña:

```bash
npm run dev
```

¡🎉Funciona!

Hora de darle un poco de cariño al diseño :)

Añadimos un componente _hero_ para mostrar el título de la publicación.

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
+ import Hero from '#components/hero.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

_./src/pages/posts/[slug].astro_

```diff
---
 <Layout title={entry.title}>
+  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
 </Layout>
```

En el _aside_ tenemos diferentes elementos, así que definámoslos aquí:

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
+ import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
+ import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
+ import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
```

_./src/pages/posts/[slug].astro_

```diff
---
 <Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
  <h2>{entry.title}</h2>
+  <Fragment slot="aside">
+    <MiniBioPod type="card" />
+    <NewsletterPod type="mini" />
+    <PopularPostsPod />
+  </Fragment>

 </Layout>
```

> Fijate que aquí estamos referenciando slots que se encuentra definidos en el layout principal.

¿Qué tal va quedando esto?

```bash
npm run dev
```

Toca ir a por el cogollo de este caso: el contenido de la publicación. Crearemos un componente separado para esto.

_src/pods/post/post.pod.astro_

```astro
---
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  postEntry: Post;
}

const { postEntry } = Astro.props;

const likeCount = 6;

const postContent = {
  backButton: 'Go back',
  published: 'Published',
  minRead: 'min read',
};
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

Añadimos este componente en la página de detalle de la publicación.

_./src/pages/posts/[slug].astro_

```diff
---
import Layout from '#layouts/layout.astro';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPostsPod from '#pods/popular-posts/popular-posts.astro';
import { getAllPosts } from '#pods/post-collection/post-collection.api';
+ import PostPod from '#pods/post/post.pod.astro';

// Generate all possible paths
export async function getStaticPaths() {
  const postEntries = await getAllPosts();
  return postEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

// Per path let's generate the page
const { entry } = Astro.props;
---

<Layout title={entry.title}>
  <Hero url={entry.image.url} slot="hero" />
-  <h2>{entry.title}</h2>
+  <PostPod postEntry={entry} />
  <Fragment slot="aside">
    <MiniBioPod type="card" />
    <NewsletterPod type="mini" />
    <PopularPostsPod />
  </Fragment>
</Layout>
```

Y bueno, se ve algo, pero nos queda un poco más de trabajo, necesitamos un encabezado y un cuerpo para la publicación, así que creamos dos nuevos componentes, dentro del pod `post` agregando una nueva carpeta llamada **components**.

_src/pods/post/components/header.astro_

```astro
---
import ArrowLeftIcon from '#assets/icons/arrow-left.svg';

interface Props {
  gobackText: string;
  publishedText: string;
  date: string;
}
const { gobackText, publishedText, date } = Astro.props;
---

<header class="flex items-start justify-between">
  <a href="/" class="hover:text-primary-600 flex items-center gap-2 font-semibold transition-colors">
    <ArrowLeftIcon />
    {gobackText}
  </a>

  <p class="text-sm">
    {publishedText}{' '}
    <time datetime={date}>
      {
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    </time>
  </p>
</header>
```

Y lo usamos en el pod de post.

_src/pods/post/post.pod.astro_

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
+ import Header from '#pods/post/components/header.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
+ <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
  <div>{postEntry.title}</div>
  <div>{postEntry.content}</div>
</section>
```

Va mejorando la cosa... seguimos, creamos el componente del cuerpo.

Primero definimos el componente y el código entre rejas (fences):

_src/pods/post/components/body.astro_

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';

interface Props {
  entry: Post;
  likeCount: number;
  minReadText: string;
}

const { entry, likeCount, minReadText } = Astro.props;
---
```

Y el HTML:

_src/pods/post/components/body.astro_

```astro
<div class="flex flex-col gap-6">
  <h1 class="text-tbase-500/90 text-5xl leading-[1.1] font-bold" id="article-section-heading">
    {entry.title}
  </h1>

  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
    <div class="flex items-center">
      <button
        type="button"
        class="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
        aria-label="Like"
      >
        <HeartIcon class="h-5.5 w-5.5 transition-colors duration-300 group-hover:text-red-500" />
      </button>
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
  <div>{entry.content} </div>
</div>
```

Y usamos este componente dentro del pod de publicación.

_src/pods/post/post.pod.astro_

```diff
---
import type { Post } from '#pods/post-collection/post-collection.model';
import Header from '#pods/post/components/header.astro';
+ import Body from '#pods/post/components/body.astro';

// (...)
---

<section class="flex shrink-1 grow flex-col gap-12 px-6 py-4">
  <Header gobackText={postContent.backButton} publishedText={postContent.published} date={postEntry.date} />
+  <Body entry={postEntry} likeCount={likeCount} minReadText={postContent.minRead} />
-  <div>{postEntry.title}</div>
-  <div>{postEntry.content}</div>
</section>
```

Mucho mejor, pero el contenido aún no se está renderizando como HTML. Para solucionar esto, podemos usar un contenedor con _Marked_ y _highlight.js_ para renderizar correctamente el contenido, y usarlo dentro del componente del cuerpo.

_src/pods/post/components/body.astro_

```diff
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '#pods/post-collection/post-collection.model';
+ import MarkdownRenderer from '#components/markdown-renderer.astro';
---
```

```diff
      <span class="text-xs">{likeCount}</span>
    </div>
  </div>
-  <div>{entry.content}</div>
+  <MarkdownRenderer content={entry.content} />
</div>
```

Y...

```bash
npm run dev
```

Ya se ve genial :).
