# Colecciones de Contenido y Rutas Dinámicas

Una funcionalidad que ofrece Astro que es muy interesante es la de poder gestionar colecciones de ficheros Markdown.

Esto nos permite tener en nuestro proyecto ficheros de markdown con contenido y metadatos y generar páginas dinámicas a partir de ellos.

Es muy útil si quieres mostrar documentación técnica o un blog sencillo.

## 1. Configuración de Colecciones de Contenido

Vamos a configurar una colección de contenido para un blog sencillo.

### Agregar Archivo de Configuración

Lo primero que hacemos es crear una carpeta llamada `content` dentro de `src`, que es donde vamos a guardar nuestros ficheros markdown.

Seguimos, creamos un archivo `config.ts` dentro de `content`, que es donde vamos a definir la estructura de nuestras colecciones.

_./src/content/config.ts_

```typescript
import { defineCollection, z } from "astro:content";

const postCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  postCollection,
};
```

**Qué hace esto:**

- Define una `postCollection` con tipo "content" para archivos markdown
- Usa el esquema Zod para validar los datos del frontmatter.
- Garantiza tipado seguro en toda la aplicación

Aquí te habrás quedado pensando como cuando vas al mecánico, te dice "Ha sido la junta de la trócola" y tu pones cara de poker, así que, veamos esto más en detalle:

Cuando defines un markdown de contenido para Astro, puedes usar el área entre rejas (las fences) para añadir metadatos, en este caso, puede ser el título del post, una descripción corta del mismo, o una imagen representativa, lo suyo es tipar esto de alguna forma para que no haya errores, y aquí es donde entra en juego `Zod`, que es una librería de validación y tipado de datos muy interesante (de ahí todas esas entradas que empiezan por z.XXX).

### Estructura del Contenido

Nuestras publicaciones del blog se almacenan en `./src/content/postCollection/` con la siguiente estructura:

```
src/
└── content/
    ├── config.ts
    └── postCollection/
        ├── astro-image-component.md
        ├── astro-new-features.md
        └── modern-css-techniques.md
```

Cada archivo markdown incluye un frontmatter que coincide con nuestro esquema.

Puedes obtener el contenido de los archivos desde el repositorio:

https://github.com/content-island/demos-academia-midudev-astro-hcms/tree/main/99-recursos/00-posts-md

## 2. Implementación de Páginas del Blog

Ya tenemos una colección de posts, ahora vamos a crear las páginas para mostrarlos.

Crearemos una que tenga el listado de los posts y otra para cada post individual usando rutas dinámicas.

Agregamos un enlace al blog en `index.astro`:

_./src/pages/index.astro_ (adición)

```diff
  <h1>{title}</h1>
	<DogPics urls={dogImageUrls} />
	<div>
		<button id="cat-image-button">Get Cat Image</button>
	</div>
	<div>
		<img id="cat-image" style="max-width: 400px; height: auto;"/>
	</div>
	<a href="/about">Go to about page</a>
+ <a href="/blog">Go to blog page</a>
```

### Crear Página de Índice del Blog

Creamos una nueva carpeta en `pages` llamada `blog` para contener el índice y las páginas individuales del blog.

Crea `/src/pages/blog/index.astro` para listar todas las publicaciones.

¿Qué hacemos aquí? Pues Astro nos ofrece una función llamada `getCollection` que nos permite obtener todos los ficheros de una colección concreta, en este caso `postCollection` (el nombre de la carpeta que creamos), iteramos y mostramos los títulos y enlaces a cada post.

_./src/pages/blog/index.astro_

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

const posts = await getCollection("postCollection");
---

<BaseLayout title="Blog">
  <h1>Blog</h1>
  <ul>
    {
      posts.map((post) => (
        <li>
          <a href={`/blog/${post.slug}`}>{post.data.title}</a>
        </li>
      ))
    }
  </ul>
  <a href="/">Go back home</a>
</BaseLayout>
```

> Necesitarás compilar el proyecto para eliminar el error relacionado con la falta de tipo en `post`.

**Características clave:**

- Usa `getCollection("postCollection")` para obtener todas las publicaciones del blog.
- Genera automáticamente los enlaces usando el `slug` del archivo (el nombre del archivo sirve para identificar el post como fragmento de url) y `data.title` del frontmatter

### Páginas Dinámicas de Publicaciones

Ya tenemos la lista pero si pulsamos en un post nos da un 404, vamos a solucionarlo.

Las páginas individuales del blog se generan usando rutas dinámicas con `[slug].astro`, es decir ese _slug_ es un parámetro dinámico.

Y ahora viene una parte muy interesante ¿Cómo se generan esa rutas dinámicas?

Si eres fan de las pelis de _Marvel_, y viste _infinity wars_ recordarás que había un momento en el que _Dr. Strange_ veía millones de futuros posibles, y elegía el único en el que ganaban, ... aquí hacemos algo parecido, con _getStaticPaths_ calculamos todas las rutas posibles (una por cada post) y aquí en vez de elegir una, las generamos todas.

Créala dentro de la carpeta `blog`.

_./src/pages/blog/[slug].astro_

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("postCollection");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout title={post.data.title}>
  <h1>{post.data.title}</h1>
  <img
    src={post.data.image}
    alt={post.data.title}
  />
  <p>{post.data.description}</p>
  <article>
    <Content />
  </article>
  <a href="/blog">Back to blog</a>
</BaseLayout>
```

**Explicación:**

- `getStaticPaths()` genera automáticamente todas las rutas dinámicas (`/blog/[slug]`).
- `entry.render()` procesa de forma segura el Markdown y devuelve el componente `Content`.
- Los metadatos se renderizan junto con el contenido de la publicación.

Cómo hemos visto, gestionar colecciones de ficheros Markdown en Astro, está muy bien, pero esto se te puede quedar corto si quieres hacer cosas como que perfiles no técnicos puedan añadir o modificar contenido, o si quieres reaprovecharlo en otras plataformas, para eso, en la siguiente parte de este curso veremos como integrar un Headless CMS con Astro.
