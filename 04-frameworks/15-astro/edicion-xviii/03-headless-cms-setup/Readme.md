# Setup content Island

En Content Island podemos consumir contenido estático en el mismo proyecto, por ejemplo de ficheros MD en el mismo repo, pero lo ideal es separar esto y permitir a los editores de contenido trabajar en un entorno más amigable, es decir conectarlos con un Headless CMS, tienes varias opciones: Strapi, ContentFul, ...

En nuestro caso vamos a usar Content Island.

Tenemos ya los datos preparados, vamos a hacer un pequeño tour:

- Nos logamos.
- Aquí puedes ver el módelo que hemos definido.
- Los datos sobre about.
- Los posts.

Vamos a hacer el setup de Content Island en nuestro código ¿Qué nos va a hacer falta?

- Instalarnos la librería de cliente de Content Island.
- Añadir una variable de entorno con el API Key de nuestro proyecto en content Island.

Para instalar la librería de cliente de Content Island

```bash
npm install @content-island/api-client --save
```

También nos hace falta añadir como variable de entorno el API Key de nuestro proyecto en Content Island.

Para ello nos vamos a content island, elegimos el proyecto en el que estamos trabajando

Ahora creamos un fichero `.env` en el raíz del proyecto y añadimos la variable de entorno:

```
CONTENT_ISLAND_SECRET_TOKEN=API_KEY
```

Y desde Astro 5, podemos tipar las variables de entorno de esta manera, abrimos el fichero existente:

_./astro.config.mjs_

```js
import { defineConfig, envField } from "astro/config";

export default defineConfig({
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

> Está variable se ejecutará en el servidor, cuando Astro generé el sitio web estático.

Vamos ahora iniciar la librería de Content Island en nuestro proyecto e inyectarle la API Key.

_./src/lib/client.ts_

```ts
import { CONTENT_ISLAND_SECRET_TOKEN } from "astro:env/server";
import { createClient } from "@content-island/api-client";

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN,
});

export default client;
```

> Si sale en rojo el import haz build (Astro crea los tipos para las variables de entorno en tiempo de build).

Y ya lo tenemos todo listo para empezar a trabajar con Content Island :).
