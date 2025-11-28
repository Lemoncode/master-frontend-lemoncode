# 04 Integración con React

Una característica muy importante que mencionamos al arrancar este curso es que Astro puede integrarse fácilmente con tus frameworks favoritos, convirtiéndolo en lo que llamamos "el framework buena gente", esto es muy útil cuando necesitas incoporar funcionalidad rica a tu interfaz de usuario.

Vamos a aprender como funciona esto, utilizaremos React para implementar un ejemplo sencillo (un botón de "me gusta").

> A tener en cuenta: hemos elegido un ejemplo simple para que sea más fácil de entender, normalmente utilizaremos esto para funcionalidades más complejas, y frameworks más ligeros como PReact o Solid.

¡ Manos a la obra !

## Paso 1: Instalando React

Instalamos la integración de React para Astro:

```bash
npm install @astrojs/react
```

Y actualizamos el archivo `astro.config.mjs` para agregar esta integración:

```diff
// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
+ import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
+  integrations: [react()],
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
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

## Paso 2: Crear el componente React

Ahora creamos el componente React para nuestro botón de “me gusta”.

Por simplicidad, solo almacenaremos el número de “me gusta” en el `localStorage` del navegador. En una aplicación real, probablemente, conectaríamos con una API REST y  guardaríamos esta información en una base de datos.

Agregamos un nuevo archivo llamado **like-button.component.tsx** dentro de la carpeta de componentes del pod de publicación.

_./src/pods/post/components/like-button.component.tsx_

```tsx
import { useState, useEffect } from "react";

export const LikeButton: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    const storedLikes = localStorage.getItem("likes");
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
  }, []);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem("likes", newLikes.toString());
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
        aria-label="Like"
        title="Like this post"
        onClick={handleLike}
      >
        <svg
          aria-hidden="true"
          className="flex h-5.5 w-5.5 items-center justify-center transition-colors duration-300 group-hover:text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 19.75a.75.75 0 0 1-.53-.22L4.7 12.74a5 5 0 0 1 0-7a4.95 4.95 0 0 1 7 0L12 6l.28-.28a4.92 4.92 0 0 1 3.51-1.46a4.92 4.92 0 0 1 3.51 1.45a5 5 0 0 1 0 7l-6.77 6.79a.75.75 0 0 1-.53.25m-3.79-14a3.44 3.44 0 0 0-2.45 1a3.48 3.48 0 0 0 0 4.91L12 17.94l6.23-6.26a3.47 3.47 0 0 0 0-4.91a3.4 3.4 0 0 0-2.44-1a3.44 3.44 0 0 0-2.45 1l-.81.81a.77.77 0 0 1-1.06 0l-.81-.81a3.44 3.44 0 0 0-2.45-1.02"
          />
        </svg>
      </button>
      <span className="text-xs">{likes}</span>
    </div>
  );
};

export default LikeButton;
```

## Paso 3: Usar el componente React en una página Astro

Por último usamos el componente React dentro de nuestra página Astro.

_src/pods/post/components/body.astro_

```diff
---
- import HeartIcon from '#assets/icons/heart.svg';
+ import LikeButton from './like-button.component.tsx';
import type { Post } from '#pods/post-collection/post-collection.model';
import MarkdownRenderer from '#components/markdown-renderer.astro';

interface Props {
  entry: Post;
  likeCount: number;
  minReadText: string;
}

const { entry, likeCount, minReadText } = Astro.props;
---
```

```diff
  <div class="border-tbase-500/40 mb-2 flex items-center justify-between gap-4 border-y py-2">
    <p class="text-xs">{entry.readTime} {minReadText}</p>
-    <div class="flex items-center">
-      <button
-        type="button"
-        class="group w-fit cursor-pointer rounded-full p-1 transition-colors duration-300"
-        aria-label="Like"
-      >
-        <HeartIcon class="h-5.5 w-5.5 transition-colors duration-300 group-hover:text-red-500" />
-      </button>
-      <span class="text-xs">{likeCount}</span>
-    </div>
+    <LikeButton client:load />
  </div>
  <MarkdownRenderer content={entry.content} />
```

> **IMPORTANTE:** `client:load` permite que el componente se ejecute en el lado del cliente. Prueba a eliminar `client:load` y ver qué sucede al hacer click en el botón.

¿Lo probamos?

```bash
npm run dev
```

Incluso podemos depurarlo en el navegador… 🔍
