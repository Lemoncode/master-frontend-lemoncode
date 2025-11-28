# Home Page - Listado de posts

Vamos a por la página principal, en este caso queremos mostrar un listado de los posts que se han publicado.

¿Cómo funciona esto en Astro? En tiempo de generación leemos todos los posts y montamos la página de listado, el resultado final es un HTML estático que se sirve al cliente con el listado de proyectos.

Para ellos vamos a crearnos una carpeta _posts_ en la que definiremos modelo y api para traernos la lista.

_./posts/post.model.ts_

```ts
export interface SinglePost {
  id: string;
  title: string;
  date: string;
  summary: string;
  author: string;
  content: string;
  image: {
    name: string;
    link: string;
  };
}
```

Y ahora vamos a por la API, para traernos el listado de posts tiramos de _getContentList_, le indicamos el nombre del contenido y mapeamos el contenido a nuestro modelo.

_./posts/post.api.ts_

```ts
import client from "../../lib/client";
import type { SinglePost } from "./post.model";
import { mapContentToModel } from "@content-island/api-client";

export async function getPosts(): Promise<SinglePost[]> {
  const response = await client.getContentList({
    contentType: "Post",
  });

  const posts = response.map((content) =>
    mapContentToModel<SinglePost>(content),
  );

  return posts;
}
```

Y en la página principal vamos a traernos los posts y mostrarlos.

En el código de ejecución de la generación en servidor, leemos la lista de posts y añadimos una función para formatear la fecha.

_./src/pages/index.astro_

```astro
---
import { Image } from "astro:assets";
import Layout from "../layouts/Layout.astro";
import { getPosts } from "./posts/post.api";

const posts = await getPosts();

const date = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
---
```

Vamos ahora a mostrar los datos sin diseño:

```astro
<Layout>
  <ul>
    {
      posts.map((post) => (
        <li>
          <h2>
            <a href={`/posts/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>
              {post.title}
            </a>
          </h2>
          <p>
            <strong>Author:</strong> {post.author}
          </p>
          <p>{post.summary}</p>
        </li>
      ))
    }
  </ul>
</Layout>
```

Se ve... aunque bien feo ¿Le añadimos diseño?

Metemos unos estilos al final del fichero:

```astro
<style>
  .posts__header {
    text-align: center;
    margin-bottom: var(--space-lg);
    h1 {
      font-size: var(--fs-3xl);
      font-family: var(--ff-title);
    }
  }
  .posts__list {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    justify-items: center;
    gap: var(--space-lg);
  }
  .post {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }
  .post__image {
    width: 100%;
    height: auto;
    object-fit: cover;
    object-position: top;
    aspect-ratio: 16/9;
    border-radius: var(--border-radius);
  }
  .post__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .post__header {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .post__date {
    font-size: var(--fs-2xs);
    opacity: 0.7;
  }

  .post__title {
    text-decoration: none;
    color: var(--text-color);
    transition: color 0.3s ease-in-out;
    &:hover {
      color: var(--title-hover-color);
    }

    h2 {
      font-size: var(--fs-lg);
      font-family: var(--ff-title);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.175;
    }
  }

  .post__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
</style>
```

Cambiamos lo que hemos metido en Layout por esto:

```astro
<Layout>
  <section class="container">
    <div class="posts__header">
      <h1>CurioVerso Blog</h1>
      <p>All Posts</p>
    </div>

    <ul class="posts__list">
      {
        posts.map((post) => (
          <li>
            <article class="post">
              <a
                href={`/posts/${post.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-")}`}
              >
                <Image
                  src={post.image.link}
                  alt={post.image.name}
                  width={250}
                  height={100}
                  class:list={"post__image"}
                  loading="eager"
                />
              </a>
              <div class="post__text">
                <div class="post__header">
                  <p class="post__date">
                    <time datetime="2025-03-05">{date(post.date)}</time>
                  </p>
                  <a
                    href={`/posts/${post.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")}`}
                    class="post__title"
                  >
                    <h2>{post.title}</h2>
                  </a>
                </div>
                <div>
                  <p class="post__description">{post.summary}</p>
                </div>
              </div>
            </article>
          </li>
        ))
      }
    </ul>
  </section>
</Layout>
```

Ha quedado bien :), ¿Nos animamos ahora con la página que muestra un sólo post?
