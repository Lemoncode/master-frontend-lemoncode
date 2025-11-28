# Lista de posts

Si abrimos la página home, podemos ver que el contenido principal está vacío, aquí es donde debería de mostrarse la lista de posts.

¿De dónde podemos obtener esa lista? De nuestro proyecto en **Content Island**.

**Cargando la lista**

Vamos a obtener la lista de publicaciones desde Content Island.

Creamos un nuevo **Pod** y lo llamaremos `post-collection`.

Añadimos el modelo de publicación en un nuevo archivo llamado **post-collection.model.ts**.

**Copiar desde Content Island**

_./src/pods/post-collection/post-collection.model.ts_

```ts
import type { Media } from '@content-island/api-client';

export interface Post {
  id: string;
  language: 'en';
  title: string;
  slug: string;
  date: string; // Stores the date in ISO 8601 format. For example: 2021-09-10T19:30:00.000Z
  summary: string;
  image: Media;
  content: string;
  readTime: number;
}
```

Y la API para cargar las publicaciones:

_./src/pods/post-collection/post-collection.api.ts_

```ts
import client from '#lib/client.ts';
import type { Post } from './post-collection.model';

export const getAllPosts = async () =>
  await client.getContentList<Post>({
    contentType: 'Post',
    sort: { 'fields.date': 'desc' },
    pagination: { take: 6 }
  });
```

Esta vez obtenemos la lista de posts ordenada por fecha descendente, y limitamos el número de posts a 6.

Toca ahora definir el component pod (la interfaz de usuario de entrada para esta funcionalidad rica) lo llamamos  **post-collection.pod.astro** y como hemos hecho en pasos anteriores, hacemos una prueba rápida para comprobar que los datos se cargan correctamente.

_./src/pods/post-collection/post-collection.pod.astro_

```astro
---
import { getAllPosts } from './post-collection.api.ts';

const posts = await getAllPosts();
---
<section class="flex flex-1 flex-col gap-9">
{posts.map((post) => (
      <h2>{post.title}</h2>
))}
</section>
```

Usamos este pod en la página principal:

_./src/pages/index.astro_

```diff
---
import Layout from '#layouts/layout.astro';
import { getCollection } from 'astro:content';
import Hero from '#components/hero.astro';
import MiniBioPod from '#pods/mini-bio/mini-bio.pod.astro';
import NewsletterPod from '#pods/newsletter/newsletter.pod.astro';
import PopularPosts from '#pods/popular-posts/popular-posts.astro';
+ import PostCollectionPod from '#pods/post-collection/post-collection.pod.astro';

const homeContent = {
  hero: {
    title: "Blog de Desarrollo Web de John",
    description: 'Aquí puedes encontrar varios artículos sobre desarrollo de aplicaciones web.',
  },
};
---
```

```diff
  </Hero>

-  <div>Place holder for post preview collection</div>
+  <PostCollectionPod />

  <Fragment slot="aside">
```

Y si ejecutamos el proyecto, veremos la lista de publicaciones (solo los títulos por ahora).

```bash
npm run dev
```

Hora de darle cariño estilándolo: vamos a definir un componente que mostrará una tarjeta de publicación.

Creamos una nueva carpeta dentro del pod `post-collection` llamada **components**, y dentro de ella un nuevo archivo llamado **post-card.astro**.

Primero definimos el código dentro de los fences (rejas), para importar un icono, el modelo, y definir las props:

_./src/pods/post-collection/components/post-card.astro_

```astro
---
import HeartIcon from '#assets/icons/heart.svg';
import type { Post } from '../post-collection.model';

interface Props {
  post: Post;
}
const { post } = Astro.props;
const readTimeLabel = 'min read';
---
```

> Un tema interesante, cuando desarrollamos una página con Astro no es mala idea llevar ciertos literales que están en el HTML a variables en el FrontMatter (en nuestro caso el _readTimeLabel_), de esta forma si en el futuro queremos hacer internacionalización o simplemente cambiar un texto, no tenemos que bucear por el HTML y podemos extraerlo más fácilmente.

Y ahora vamos a por el HTML:

```astro
<a
  href={`/posts/${post.slug}`}
  class="group @container cursor-pointer rounded-4xl transition-shadow duration-300 hover:shadow-lg"
>
  <article class="flex h-full flex-col @lg:flex-row">
    <div class="aspect-[16/9] overflow-hidden rounded-4xl bg-gray-300 @lg:flex-1">
      <img
        src={post.image.url}
        alt={post.title}
        class="h-full w-full rounded-4xl object-cover transition-transform duration-300 group-hover:scale-[1.06]"
        aria-hidden="true"
      />
    </div>
    <div class="flex flex-1 flex-col justify-between gap-6 p-4 @lg:flex-2">
      <div>
        <time datetime={post.date} class="mb-1 block text-xs">
          {
            new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }
        </time>
        <h3
          class="group-hover:text-primary-700 text-tbase-500/90 mb-2 text-xl font-bold transition-colors duration-300"
        >
          {post.title}
        </h3>
        <p class="text-sm">{post.summary}</p>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs">{post.readTime} {readTimeLabel}</span>
        <div class="flex items-center gap-1">
          <HeartIcon class="h-5 w-5" />
          <span class="text-xs">{6}</span>
        </div>
      </div>
    </div>
  </article>
</a>
```

Toca usarlo en nuestro pod de lista de posts:

_./src/pods/post-collection/post-collection.pod.astro_

```diff
---
import { getAllPosts } from './post-collection.api.ts';
+ import PostCard from './components/post-card.astro';

const posts = await getAllPosts();
---

<section class="flex flex-1 flex-col gap-9">
-  {posts.map(post => <h2>{post.title}</h2>)}
+  {posts.map(post => <PostCard post={post} />)}
</section>
```

Nada mal, agreguemos un poco más de estilo…

_./src/pods/post-collection/post-collection.pod.astro_

```diff
<section class="flex flex-1 flex-col gap-9">
+  <div class="grid max-w-[895px] gap-8 xl:grid-cols-2">

  {posts.map(post => <PostCard post={post} />)}
+  </div>

</section>
```

¡Y listo! 😊
Ahora, si hacemos click en una publicación, obtendremos un **404**, pero eso lo solucionaremos en el siguiente paso, donde mostraremos una publicación individual.
