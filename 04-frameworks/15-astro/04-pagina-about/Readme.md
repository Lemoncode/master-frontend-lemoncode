# About page

Vamos a montar la página de About, aquí podemos tomar dos aproximaciones:

- Una sería montar el HTML de forma estática en Astro y después enlazar los datos de Content Island.

- Otra es traernos los datos de Content Island, montar un HTML sin estilo, conectarlo todo y cuando esté todo listo añadir los estilos.

Ambas aproximaciones son igual de válidas, depende de tus preferencias y de cómo te sientas más cómodo, quizás si eres desarrollador prefieras asegurarte que los datos cargan y después quizás pasarle este trabajo a un diseñador y que haga su magia :).

Vamos a por la segunda opción, nos ponemos nuestras gafas de desarrollador y empezamos a trabajar.

Lo primero, estamos trabajando con TypeScript, vamos a definir el modelo que nos traemo de About page.

Si nos vamos a content island, en el tab de modelo, podemos ver que tenemos un modelo de About, con los siguientes campos:

- `title`: Título de la página.
- `picture`: Foto.
- `minibio`: Mini bio.
- `bio`: Bio extendida.

Vamos a pasar esto a código:

_./src/pages/about/about.model.ts_

```ts
export interface About {
  id: string;
  picture: {
    name: string;
    link: string;
  };
  fullname: string;
  shortBio: string;
  extendedBio: string;
}
```

Y ahora vamos a definir una API para extraer estos datos:

¿Qué vamos a hacer aquí?

- Definir una funcíon asíncrona `getAbout` que nos traiga los datos de Content Island.

- Aquí tiramos de la librería de Content Island y nos traemos los datos de About, para ello tiramos de la función `getContentList` y le pasamos el `contentType` de About.

- Lo siguiente es mapear los datos que nos trae Content Island a nuestro modelo de datos, para ello usamos la función de ayuda que trae la librería de Content Island `mapContentToModel`.

_./src/pages/about/about.api.ts_

```ts
import { mapContentToModel } from "@content-island/api-client";
import client from "../../lib/client";
import type { About } from "./about.model";

export async function getAbout(): Promise<About> {
  const aboutContent = await client.getContent(
    // TODO: IMPORTANTE PON EL ID QUE TENGAS EN TU INSTANCIA
    // DE About en Content Island
    "67c9817f98e17b1396f20d0f",
    {
      contentType: "About",
    },
  );

  return mapContentToModel<About>(aboutContent);
}
```

## Workaround opcional

Aquí puede que te salga en rojo el _Promise<About>_, si eses el caso tocamos el _tsconfig.json_:

```diff
{
  "extends": "astro/tsconfigs/strict",
+  "compilerOptions": {
+    "target": "ESNext",
+    "lib": ["ESNext", "DOM"],
+    "moduleResolution": "Node",
+    "skipLibCheck": true
+  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

> Aquí le indicamos que use la última versión de ECMAScript, que incluya las definiciones necesarias para _Promise_, y también le decimos que evita conflictos con definiciones de librerías externas.

## Layout y conexión

Ahora que lo tenemos, vamonos a la página de About y montamos un layout muy básico para ver que se están mostrando los datos.

Lo primero vamos a por el código que se ejecuta en servidor (el que está entre rejas :))

_./src/pages/about/index.astro_

```diff
---
import Layout from '../../layouts/Layout.astro';
+ import { getAbout } from './about.api.ts';

+ const about = await getAbout();
---
```

Y vamos a mostrar info:

_./src/pages/about/index.astro_

```astro
<Layout>
  <div class="container about">
    <h1>About</h1>
    <img src={about.picture.link} alt={about.fullname} />

    <h2>{about.fullname}</h2>
    <p><strong>Short Bio:</strong> {about.shortBio}</p>
    <p><strong>Extended Bio:</strong> {about.extendedBio}</p>
  </div>
</Layout>
```

¡ Ey ! Ya se ve algo, mmm falta una cosa, el campo de bio extendida, este campo tiene algo especial y es que es MarkDown, como lo estamos generando de forma dinámica vamos a instalar una librería para que lo procese.

```bash
npm install marked
```

Y ya que estamos (nos preparamos para los blogs), otra librería que haga syntax highlighting para cuando peguemos código en el markdown.

```bash
npm install highlight.js
```

Vamos a darle un poco de estilo y vamos a procesar el markdown:

Primero en el _código entre rejas_

_./src/pages/about/index.astro_

```diff
---
+ import { marked } from 'marked';
import Layout from '../../layouts/Layout.astro';
import { getAbout } from './about.api.ts';

const about = await getAbout();

+ const aboutExtendedBio = marked(about.extendedBio || '');
---
```

Al final del componente, añadimos esto:

```astro
<style>
  .about {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .about__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-end;
  }

  @media screen and (min-width: 768px) {
    .about__header {
      flex-direction: row;
    }
  }

  .about__intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);

    h1 {
      font-size: var(--fs-4xl);
      font-family: var(--ff-title);
      width: 10ch;
      line-height: 1.1;
    }
    p {
      max-width: 30ch;
      font-size: var(--fs-md);
    }
  }
  @media screen and (min-width: 768px) {
    .about__intro {
      padding-bottom: var(--space-md);
    }
  }

  .about__image {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 16/9;
    border-radius: var(--border-radius);
  }
  @media screen and (min-width: 768px) {
    .about__image {
      width: 50%;
      aspect-ratio: 10/16;
    }
  }
  @media screen and (min-width: 1024px) {
    .about__image {
      width: 30%;
    }
  }
  .about__bio {
    max-width: 800px;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);

    img {
      width: 100%;
      object-fit: cover;
      aspect-ratio: 21/9;
      border-radius: var(--border-radius);
    }
  }
</style>
```

Y vamos a cambiar el layout

```diff
  <div class="container about">
-    <h1>About</h1>
-    <img src={about.picture.link} alt={about.fullname} />
-
-    <h2>{about.fullname}</h2>
-    <p><strong>Short Bio:</strong> {about.shortBio}</p>
-    <p><strong>Extended Bio:</strong> {about.extendedBio}</p>

+    <div class="about__header">
+      <img src={about.picture.link} alt="" class="about__image" />
+      <div class="about__intro">
+        <h1>I'm, <br /> {about.fullname}</h1>
+        <p>
+          {about.shortBio}
+        </p>
+      </div>
+    </div>
+    <div set:html={aboutExtendedBio} class="about__bio" />
+  </div>
```

Vaya, esto tiene buena pinta :)

¿Vamos a por la lista de posts?
