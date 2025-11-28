# Server Actions

Como hemos visto con el HCMS, Astro puede interacutar con APIs de servidor.

Pero hay ocasiones en las que igual queremos tener una lógica de servidor encapsulada en nuestra aplicación.

Aquí tenemos varias opciones:

- Bien tener nuestra API de Backend configurar CORS etc...

- También podemos tene nuestra API De Backend en otro proyecto, pero a la hora del deploy copiamos a la carpeta `dist` o `public` el build de nuestro proyecto Astro.

- Otra opción es utilizar las Server Actions de Astro.

La server actions hace algo parecido a la opción 2, pero de una manera más sencilla.

> ¡ Ojo ! ¿Esto está bien? ¿No es Sphagetti Code? Es buena aproximacíon cuando la interacción con el server es pequeña, por ejemplo el formulario de contacto.

Nos ponemos manos a la obra

## Paso a paso

En este caso vamos a almacenar el número de likes en el servidor.

Por simplicidad vamos a almacenar ese valor en una variable en memoria (lo suyo sería guardarlo en base de datos y además guardar un mapeo de like por id de artículo).

Lo primero que hacemos es el setup de la acción de servidor, aquí podemos elegir si tirar de `Node.js`, `Vercel`, `Netifly` o `Deno`.

Vamos a por node:

```bash
npm install @astrojs/node
```

Y en _astro.config.mjs_ añadimos configuración:

```diff
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
+ import node from '@astrojs/node';

export default defineConfig({
  integrations: [react()],
+  output: "static",
+  adapter: node({ mode: 'standalone' }), // Configuración para Node.js
  env: {
    schema: {
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
        default: "INFORM_VALID_TOKEN",
      }),
    },
  },
});
```

Vamos a simular que tenemo un sitio para guaradar los datos (aquí lo normal sería una base de datos, vamos a tirar de variable en memoria)

_./src/actions/repository.ts_

```ts
let likeCount = 0; // Contador en memoria

export const getLikes = async () => {
  return likeCount;
};

export const addLike = async () => {
  likeCount += 1;
  return likeCount;
};
```

Y vamos a definir la acción de servidor, vamos a tiparla también, ojo, muy importante la carpeta

_./src/actions/model.ts_

```ts
export type LikesResponse = { likes: number };
```

Y las acciones de servidor:

_./src/actions/index.ts_

```ts
import { defineAction } from "astro:actions";
import { addLike, getLikes } from "./repository";
import type { LikesResponse } from "./model";

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler() {
      return { likes: await addLike() };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler() {
      return { likes: await getLikes() };
    },
  }),
};
```
# Work around opcional

Define action nos sale en rojo, tenemos que hacer un cambio en el tsconfig:

_./tsconfig.json_

```diff
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
-    "moduleResolution": "Node",
+   "moduleResolution": "bundler",
    "skipLibCheck": true
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Vamos ahora a cambiar el component de like para que haga uso de estas funciones:

_./src/components/LikeButton.component.astro_

```diff
import { useState, useEffect } from "react";
+ import { actions } from "astro:actions";

const Like: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);

  useEffect(() => {
    // Cargar los likes desde localStorage al montar el componente
-    const storedLikes = localStorage.getItem("likes");
-    if (storedLikes) {
-      setLikes(parseInt(storedLikes, 10));
-    }
+    actions.getLikes().then((response) => {
+      setLikes(response?.data?.likes ?? 0);
+    });
  }, []);

  const handleLike = async () => {
-    const newLikes = likes + 1;
-    setLikes(newLikes);
-    localStorage.setItem("likes", newLikes.toString());
+    const result = await actions.addLike().then((response) => {
+      setLikes(response?.data?.likes ?? 0);
+    });
  };

  return (
    <button
      onClick={handleLike}
      style={{
        fontSize: "1.5rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      👍 {likes}
    </button>
  );
};

export default Like;
```

Si ahora ejecutamos podemos ver como funciona:

- Vemos que avanze el contador de likes.
- Podemos abrir network tab.
- Podemos ejecutar el server en modo JS Debugging y poner directamente los breakpoints de servidor en en VSCode.
- Y los de react en el navegador.

Y si hacemos un build podemos ver lo que genera:

```bash
npm run build
```

Alucinante ¿Verdad?
