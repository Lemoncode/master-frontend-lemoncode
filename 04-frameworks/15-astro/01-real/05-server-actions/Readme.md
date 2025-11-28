# Server Actions

En el ejemplo anterior implementamos un botón de "me gusta" con React, pero se nos quedó un poco cojo, ya que almacenabamos el número de "me gusta" en el cliente usando `localStorage`, lo ideal sería poder conectar con una base de datos o una API externa, aquí nos surgen dos temas a tener en cuenta:

- Uno, crear una api y backend sólo para esto podría ser matar moscas a cañonazos.

- Dos, si tiramos de API externa, desde cliente, igual tendríamos que configurar CORS etc...

¿Qué podemos hacer? Usar las Actions de Astro. Estas actúan como un mini servidor o función serverless que se ejecuta en el lado del servidor o en el proveedor de la nube, y pueden servirnos tanto para implementar funcionalidades ligeras de backend como para hacer de proxy (intermediario), conectar con APIs externas y ahorrarnos dolores de cabeza con CORS y otros problemas similares.

En este ejemplo, vamos a almacenar el número de “me gusta” en el servidor mientras seguimos interactuando desde el cliente. En otras palabras, tendremos un botón que, al hacer click, va a servidor incrementa el número de “me gusta” y refleja el nuevo valor en pantalla.

Por simplicidad, mantendremos este valor en memoria del servidor (idealmente, lo guardarías en una base de datos).

Nos arrancamos.

Primero, configuramos las _actions_ añadiendo un adaptador a nuestro proyecto Astro (modificamos el `astro.config.mjs`), y aquí puedes elegir Node.js, Vercel, Netlify o Deno, en nuestro caso elegimos nodejs lo que nos va a permitir no atarnos a un proveedor concreto de cloud.

Ten en cuenta que, una vez que habilites un adaptador como estos, Astro dejará de generar un sitio 100% estático: tendrás que desplegar en una plataforma que soporte el _runtime_ elegido.

```bash
npm install @astrojs/node
```

_./astro.config.mjs_

```diff
// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
+ import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
+  adapter: node({
+    mode: 'standalone',
+  }),
  integrations: [react()],
  env: {
    schema: {
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_TOKEN',
      }),
    },
  },
});
```

> El modo standalone crea su propio servidor Node, mientras que embedded se integra en un servidor Node existente

Pasamos a definir nuestras actions. Astro aplica el principio de convención sobre configuración, por lo que las acciones deben ubicarse dentro de la carpeta src/actions.

Comenzamos por definir un modelo:

_./src/actions/model.ts_

```ts
export type LikesResponse = {
  likes: number;
};
```

Luego, creamos un repositorio en memoria (en una app real lo conectarías a una base de datos o API externa).

Está vez vamos a almacenar los likes por slug (identificador único de la publicación o lección), para que cada post tenga su propio contador de "me gusta".

_src/actions/repository.ts_

```ts
// This is just an in-memory store for demonstration purposes.
// Ideally we could connect to a database or an external API.
const likeStore: Map<string, number> = new Map();

export const getLikes = async (slug: string): Promise<number> => {
  return likeStore.get(slug) ?? 0;
};

export const addLike = async (slug: string): Promise<number> => {
  const current = likeStore.get(slug) ?? 0;
  const updated = current + 1;
  likeStore.set(slug, updated);
  return updated;
};
```

Y definimos la acción en si:

_src/actions/index.ts_

```ts
import { defineAction } from "astro:actions";
import { addLike, getLikes } from "./repository";
import type { LikesResponse } from "./model";

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await addLike(slug) };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await getLikes(slug) };
    },
  }),
};
```

Vamos a actualizar el componente de React para que interactue con la server action, e introducir el cambio para que cada post tenga su propio contador de "me gusta".

> **Importante:** No olvides compilar el proyecto para que las acciones estén disponibles.

_./src/pods/post/components/like-button.component.tsx_

```diff
+ import { actions } from 'astro:actions';
import { useState, useEffect } from 'react';

+ interface Props {
+  slug: string;
+ }

- export const LikeButton: React.FC = () => {
+ export const LikeButton: React.FC<Props> = ({ slug }) => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
-    const storedLikes = localStorage.getItem('likes');
-    if (storedLikes) {
-      setLikes(parseInt(storedLikes, 10));
-    }
+    actions.getLikes(slug).then(response => {
+      setLikes(response?.data?.likes || 0);
+    });
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
-    localStorage.setItem('likes', newLikes.toString());
+    actions.addLike(slug);
  };
```

Por último, pasa la prop `slug` cuando uses el componente:

_./src/pods/post/components/body.astro_

```diff
<div class="flex flex-col gap-6">
  <h1 class="text-tbase-500/90 text-5xl leading-[1.1] font-bold" id="article-section-heading">
    {entry.title}
  </h1>

  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
-    <LikeButton client:load />
+    <LikeButton client:load slug={entry.slug} />
  </div>
  <MarkdownRenderer content={entry.content} />
</div>
```

Vamos a probarlo:

```bash
npm run dev
```

Funciona 😊, y... podemos depurarlo tanto en el cliente como en el servidor :).
