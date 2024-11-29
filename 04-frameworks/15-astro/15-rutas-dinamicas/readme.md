Hemos generado una lista de posts estática, pero ¿qué pasa si queremos mostrar una lista paginada de posts? ¿cómo podríamos hacerlo?

¿Y si quisiera hacerlo paginado? Aquí podría crearme una página con los 10 primeros posts y después generar páginas dinámicas, del tipo `blog/[page].astro` para ir renderizando los posts correspondientes a cada página.

Para ver como funcionan las páginas dinámicas, vamos a ver un ejemplo más sencillo con los tags de un blog.

¿Qué vamos a hacer?

- Suponemos que tenemos un listado conocido de tags (Esto podría sacarse de una API REST, o de un JSON).

- Vamos a crear un componente que muestra el listado de esos tags, y que al pinchar navege a un tag en concreto (lo utilizaremos en las páginas).

- Cuando el usuario pinche en un tag, le llevamos a una página que tendrá el nombre del tag (será una página dinámica, habrán tantas como tags tenga el array).

- Ahí filtramos de la lista de posts, en el frontmatter los que tengan el tag en concreto y lo mostramos (esto en un proyecto real se podría sacar de una API Rest).

Nos arrancamos por crear la página dinámica.

¿De que va esto?

- Vamos a crear una carpeta `tags` dentro de `pages`

- El nombre del parámetro que va a tener entre corchete el nombre `[tag]`, con eso le indicamos que ese campo va a ser dinámico.

- Lo siguiente, es decirle que valores puede aceptar `[tag]`, con eso Astro ya sabe cuantas páginas estáticas tiene que generar y que plantilla usar (una por cada tag en el array).

- Y ahora nos centrams en el parámetro, leemos lo que viene del parámetro `tag` (es decir, `[tag]`) e indicamos que estamos mostrando los posts que tengan ese tag.

_./src/pages/tags/[tag].astro_

```astro
---
import BaseLayout from '../../layouts/base.astro';

// Define los tipos para las rutas estáticas
interface StaticPath {
  params: {
    tag: string;
  };
}

export async function getStaticPaths(): Promise<StaticPath[]> {
  return [
    { params: { tag: "astro" } },
    { params: { tag: "blogging" } },
    { params: { tag: "hola mundo" } },
    { params: { tag: "learning in public" } },
    { params: { tag: "successes" } },
  ];
}

// Tipar los parámetros que recibe la página
interface Params {
  tag: string;
}

const { tag } = Astro.props as Params;
---
<BaseLayout pageTitle={tag}>
  <p>Posts tagged with {tag}</p>
</BaseLayout>
```

Si ahora visitamos, por ejemplo:

- `http://localhost:4321/tags/astro`
- `http://localhost:4321/tags/blogging`
- `http://localhost:4321/tags/hola%20mundo`
- `http://localhost:4321/tags/learning%20in%20public`
- `http://localhost:4321/tags/successes`

Podemos ver la página correspondiente a cada tag.

Bueno, esto funciona, pero puede ser un poco rollo tener que ir añadiendo tags a mano cada vez que metas uno en un post, ya que esto se ejecuta una sola vez y ya se genera todo estático, ¿No sería más fácil leer de los posts los tags que tenemos y generar una lista?

Vamos a hacer eso:

- Leemos todos los posts `.md`.
- Ese `md` tiene definido un frontmatter con los tags.
- Iteramos y leemos las listas.
- Las añadimos a un conjunto de tags.

Para optimizar vamos a leer la lista de posts una sola vez, aprovechando **getStaticPaths**, y se lo pasamos como prop a cada tag para que después haga el filtrado.

_./src/pages/tags/[tag].astro_

```diff
---
import BaseLayout from '../../layouts/base.astro';

+ // Deberíamos mover esto a un fichero de modelo común
+ // Ya lo estamos usando en tres sitios
+ interface Frontmatter {
+  layout: string;
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
+
+ // Tipar las props
+ interface Props {
+  posts: MarkdownInstance<Frontmatter>[];
+ }

// Define los tipos para las rutas estáticas
interface StaticPath {
  params: {
    tag: string;
  };
+   props: Props;
}

export async function getStaticPaths(): Promise<StaticPath[]> {
+ const allPosts = await Astro.glob<Frontmatter>('../posts/*.md');

  return [
-    { params: { tag: "astro" } },
+    { params: { tag: "astro"}, props: {posts: allPosts} },
-    { params: { tag: "blogging" } },
+   { params: { tag: "blogging"}, props: {posts: allPosts} },
-    { params: { tag: "hola mundo" } },
+   { params: { tag: "hola mundo"}, props: {posts: allPosts} },
-    { params: { tag: "learning in public" } },
+   { params: { tag: "learning in public"}, props: {posts: allPosts} },
-    { params: { tag: "successes" }, props: {posts: allPosts} },
  ];
}

// Tipar los parámetros que recibe la página
interface Params {
  tag: string;
}



const { tag } = Astro.params as Params;
+ const { posts } = Astro.props;
+
+ // Ahora sacamos la lista de posts que tengan el tag
+ const filteredPosts = posts.filter(post => post.frontmatter.tags?.includes(tag));
---
```

Y ahora que tenemos esa lista la podemos mostrar en la misma página de tags

_./src/pages/tags/[tag].astro_

```diff
<BaseLayout pageTitle={tag}>
  <p>Posts tagged with {tag}</p>
+  <ul>
+    {filteredPosts.map((post) => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}
+  </ul>
</BaseLayout>
```

Y ya que estamos, podemos incluso usar el componente Blog Post que creamos antes

- Lo importamos.
- Lo usamos

_./src/pages/tags/[tag].astro_

```diff
---
import type { MarkdownInstance } from "astro";
import BaseLayout from "../../layouts/base.astro";
+ import BlogPost from "../../components/blog-post.astro";
```

```diff
<BaseLayout pageTitle={tag}>
  <p>Posts tagged with {tag}</p>
  <ul>
    {
      filteredPosts.map((post) => (
-        <li>
-          <a href={post.url}>{post.frontmatter.title}</a>
-        </li>
+        <BlogPost url={post.url} title={post.frontmatter.title}/>
      ))
    }
  </ul>
</BaseLayout>
```

Vamos ahora a crear la página _index_ de los tags que va a tener la colección completa.

Antes que eso, vamos a sacar el modelo de _Frontmatter_ a un fichero común.

_./src/models/blog-post-frontmatter.ts_

```typescript
// Deberíamos de llamarlo BlogFrontMatter
export interface Frontmatter {
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
```

Y usarlo en `[tag].astro`

_./src/pages/tags/[tag].astro_

```diff
---
import type { MarkdownInstance } from "astro";
import BaseLayout from "../../layouts/base.astro";
+ import type { Frontmatter } from "../../models/blog-post-frontmatter";

- // Deberíamos mover esto a un fichero de modelo común
- // Ya lo estamos usando en tres sitios
- interface Frontmatter {
-  layout: string;
-  title: string;
-  pubDate: string;
-  description: string;
-  author: string;
-  image: {
-    url: string;
-    alt: string;
-  };
-  tags: string[];
- }
```

Y ahora vamos a por el index:

_./src/pages/tags/index.astro_

```astro
---
import BaseLayout from "../../layouts/base.astro";
import type { Frontmatter } from "../../models/blog-post-frontmatter";

const allPosts = await Astro.glob<Frontmatter>('../posts/*.md');
// Aquí usamos una aproximación más moderna para sacar los tags
const tags = [...new Set(allPosts.map((post) => post.frontmatter.tags).flat())];
const pageTitle = "Tag Index";
---
```

Y ahora mostramos la lista:

_./src/pages/tags/index.astro_

```diff
---
+ <BaseLayout pageTitle={pageTitle}>
+  <div>{tags.map((tag) => <p>{tag}</p>)}</div>
+ </BaseLayout>
```

Y ya que estamos vamos a convertir esto en enlaces:

_./src/pages/tags/index.astro_

```diff
 <BaseLayout pageTitle={pageTitle}>
-  <div>{tags.map((tag) => <p>{tag}</p>)}</div>
+  {tags.map((tag) => <p><a href={`/tags/${tag}`}>{tag}</a></p>)}
 </BaseLayout>
```

Y le añadimos unos estilos:

```diff
</BaseLayout>

+ <style>
+  a {
+    color: #00539F;
+  }
+
+  .tags {
+    display: flex;
+    flex-wrap: wrap;
+  }
+
+  .tag {
+    margin: 0.25em;
+    border: dotted 1px #a1a1a1;
+    border-radius: .5em;
+    padding: .5em 1em;
+    font-size: 1.15em;
+    background-color: #F8FCFD;
+  }
+ </style>
```

Hey, y si navegamos a `http://localhost:4321/tags`, podemos ver la lista de tags.

Podríamos añadir esta ruta a nuestro menú principal.

_./src/components/navigation.astro_

```diff
<div class="nav-links">
  <a href="/">Home</a>
  <a href="/about/">About</a>
  <a href="/blog/">Blog</a>
+ <a href="/tags/">Tags</a>
</div>
```
