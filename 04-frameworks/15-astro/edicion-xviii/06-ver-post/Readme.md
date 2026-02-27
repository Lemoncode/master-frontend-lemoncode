# Mostrar un post

Para la página en la que mostrar un post vamos a reaprovechar mucho de lo que ya hemos hecho en la página de listado de posts, y te estarás preguntando ¿Y esto por que si aquí estoy sólo cargando un post? Esto es así por como trabaja astro, en tiempo de generación se leen todos los posts y se genera cada página con el posts, con lo que es un proceso muy parecido al de la página de listado de posts.

Lo que si, para generar una página por post, en el nombre de la página le indicaremos que tire de un `[slug]`, ese slug es el nombre del post, con lo que si tenemos un post con el nombre `mi-primer-post` la página generada será `mi-primer-post.html`, y crearemos uno por cada post disponible.

Vamos a por ello, de bajo la carpeta `posts` creamos una fichero `[slug].astro`

Configuramos la generación de markdown y sintax highlighting para el markdown:

_./src/pages/posts/[slug].astro_

```astro
---
import { marked } from 'marked';
import Layout from '../../layouts/Layout.astro';
import { getPosts } from './post.api';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const validLang = hljs.getLanguage(lang || 'plaintext') ? lang || 'plaintext' : 'plaintext';
  const highlighted = hljs.highlight(text, { language: validLang }).value;
  return `<pre><code class="hljs ${validLang}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });
---
```

y dentro utilizando `getStaticPaths` generamos un slug por cada post, y en las props de la página le pasamos el post que corresponde al slug y lo vamos generando:

Añade justo antes de las rejas

```astro
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map(post => ({
    params: {
      slug: post.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-'),
    },
    props: { post },
  }));
}

const { post } = Astro.props;

const postContent = marked(post.content || '');
const postDate = new Date(post.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const postImage = `url(${post.image.link})`;
```

Y ahora vamos a mostrarlo de forma rápida:

```astro
<Layout>
  <article>
    <h1>{post.title}</h1>
    <p><strong>Date:</strong> {post.date}</p>
    <p><strong>Author:</strong> {post.author}</p>
    <img src={post.image.link} alt={post.title} width="800" />
    <p><strong>Summary:</strong> {post.summary}</p>
    <div>
      <strong>Content:</strong>
      <p>{post.content}</p>
    </div>
  </article>
</Layout>
```

Y ya que estamos vamos a ponerlo bonito, una de estilos:

```astro
<style define:vars={{ postImage }}>
  .background::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 360px;
    background-image: var(--postImage);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
  }

  .article {
    max-width: 800px;
    margin-right: auto;
    margin-left: auto;
    margin-top: var(--space-2xl);
    padding: var(--space-lg);
    background-color: var(--pure-white);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .article__header {
    text-align: center;
  }
  .article__title {
    font-size: var(--fs-3xl);
    font-family: var(--ff-title);
  }

  .article__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);

    h2 {
      margin-top: var(--space-sm);
    }
    ul {
      padding-left: var(--space-md);
    }
    img {
      width: 100%;
      object-fit: cover;
      aspect-ratio: 21/9;
      border-radius: var(--border-radius);
    }

    code {
      font-size: var(--fs-xs);
      border-radius: var(--border-radius);
      padding: var(--space-xs);
    }
  }
</style>
```

Y cambiamos el markup

```astro
<Layout>
  <div class="container background">
    <article class="article">
      <header class="article__header">
        <p>
          <time datetime="2025-03-05">{postDate}</time>
        </p>
        <h1 class="article__title">{post.title}</h1>
      </header>
      <div set:html={postContent} class="article__content" />
      <footer>
        <p>Written by <strong>{post.author}</strong></p>
      </footer>
    </article>
  </div>
</Layout>
```

¡ Y ya lo tenemos !

Si hacemos un `npm run build` podemos ver como se ha generado una página HTML por cada post que tengamos en la carpeta `posts`, y si abrimos una de ellas, veremos el HTML que se ha generado.

```bash
npm run build
```

Volvemos a arrancar

```bash
npm run dev
```
