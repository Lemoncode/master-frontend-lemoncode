# Acerca de Mini Card

# HCMS

En este proyecto, vamos a integrar un Headless CMS (HCMS) para gestionar el contenido de nuestro sitio web, de esta manera podremos separar el contenido de la presentación y que sea más fácil poder añadir y modificar información.

En cuanto a opciones de Headless CMS hay muchas, algunas populares son Strapi, Contentful, Sanity, etc. En este caso vamos a usar **Content Island**, un HCMS muy sencillo de usar.

Para no aburrirte introduciendo datos, ya tienes disponible toda la información en un **proyecto de Content Island**.

Vamos a hacer un pequeño recorrido y entender el modelo así como los datos disponibles en este proyecto:

- En el tab general puedes ver información genérica así como un token de acceso que nos permitirá conectar nuestro sitio con el HCMS.

- En el tab de model, puedes ver las distintas entidades que se han definido, puedes ver que hay:
  - Un modelo de contenido llamado **MiniBio** que contiene la información del perfil del autor.
  - Un modelo de contenido llamado **Post** que contiene la información de las publicaciones del blog.
  - Un modelo de contenido llamado **Experience** que contiene la información de cada experiencia laboral
  - Un modelo de contenido llamado **Experience Section** que contiene la list de de secciones de experiencia laboral del autor.

En la parte de contenido:

- Podemos ver la Mini bio donde ponemos una pqueña descripción del autor y foto de perfil.
- También la experiencia laboral, una entrada en experiencia.
- El listado (así podemos ordenarlo).
- Y por último los posts, donde podemos ver también un campo de tipo markdown donde podemos incluir contenido enriquecido, por ejemplo imágenes, enlaces, etc.

Si tienes curiosidad por saber como se crea el modelo e introducen los datos en este Headless CMS puedes visitar la web de Content Island donde encontrarás video tutoriales y documentación.

# Configuración

Ya que tenemos la información ¿Nos ponemos a explotarla?

Para leer estos datos, Content Island proporciona una **librería cliente API**. la instalamos:

```bash
npm install @content-island/api-client
```

Para poder leer los datos, necesitamos proporcionar un **token de acceso**. En este caso, usaremos un **token secreto**, que puedes encontrar en la configuración de tu proyecto de Content Island. Creamos un archivo .env en la raíz del proyecto y añadamos el token allí:

_/.env_

```
CONTENT_ISLAND_SECRET_TOKEN=98bfcafff2e649ed1fccec36abde3379
```

A continuación, definimos esta variable como una **variable de entorno del servidor** en Astro:

_./astro.config.mjs_

```diff
- import { defineConfig } from 'astro/config';
+ import { defineConfig, envField } from "astro/config";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: /** @type {any} */ ([tailwindcss()]),
  },
+  env: {
+    schema: {
+      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
+        context: "server",
+        access: "secret",
+        optional: false,
+        default: "INFORM_VALID_TOKEN",
+      }),
+    },
+  },
});
```

A tener en cuenta:

- Al definir la variable de entorno de esta manera, Astro generará automáticamente las definiciones de tipo necesarias para que podamos usar esta variable de entorno con seguridad de tipos en nuestro código.

- Por otro lado le decimos si es de cliente o servidor, esto nos ayuda a que no se filtre información sensible al cliente.

- También le decimos si es opcional o no, y un valor por defecto en caso de que no esté definido.

> Importante para que pille las definiciones de tipo, necesitamos hacer un build del proyecto:

```bash
npm run build
```

Todo bien, pasamos a crear una instancia del cliente de la librería de Content Island, agregamos una carpeta **lib** dentro de **src**, y creamos un archivo llamado **client.ts**.

_./src/lib/client.ts_

```ts
import { createClient } from "@content-island/api-client";
import { CONTENT_ISLAND_SECRET_TOKEN } from "astro:env/server";

const client = createClient({
  accessToken: CONTENT_ISLAND_SECRET_TOKEN,
});

export default client;
```

> Si obtienes un error al importar CONTENT_ISLAND_SECRET_TOKEN; necesitamos hacer un build para que Astro genere las definiciones de tipo para las variables de entorno.

# Uso

La sección del perfil del autor se usa en dos lugares:

- Una **tarjeta mini-bio**
- Un **mini-bio hero**, mostrado en la página _About_

Usaremos el **pod** _mini-bio_ y añadiremos funcionalidad para obtener los datos del perfil del autor y usarlos en ambos lugares.

Aquí partimos de esta parte del trabajo ya hecho:

- Las páginas usan `pods/mini-bio`.
- El pod `mini-bio` usa dos componentes: **MiniBioCard** y **MiniBioHero**, dependiendo de las props que reciba.

Empecemos extrayendo el modelo del proyecto de Content Island y agregándolo al archivo **mini-bio.model.ts**:

**COPIAR DESDE EL PROYECTO DE CONTENT ISLAND**

_./src/pods/mini-bio/mini-bio.model.ts_

```diff
export type MiniBioType = 'hero' | 'card';

+ import type { Media } from "@content-island/api-client";
+
+ export interface MiniBio {
+  id: string;
+  language: "en";
+  title: string;
+  name: string;
+  role: string;
+  description: string;
+  image: Media;
+  imageAlt: string;
+ }
```

Luego, añadamos una API para cargar los datos del perfil del autor:

_./src/pods/mini-bio/mini-bio.api.ts_

```ts
import client from "#lib/client.ts";
import type { MiniBio } from "./mini-bio.model";

export const getMiniBio = async () =>
  await client.getContent<MiniBio>({
    contentType: "MiniBio",
  });
```

> Aquí simplemente pedimos el contenido de tipo "MiniBio", sabemos que sólo hay una entrada, así que no necesitamos filtrar más.

Y la usamos en el pod mini-bio:

_./src/pods/mini-bio/mini-bio.pod.astro_

```diff
---
+ import { getMiniBio } from './mini-bio.api';
import MiniBioHero from './components/mini-bio-hero.astro';
import MiniBioCard from './components/mini-bio-card.astro';
import type { MiniBioType } from './mini-bio.model';


interface Props {
  type: MiniBioType;
}

const { type } = Astro.props;

+ const miniBio = await getMiniBio();
---

- {type === 'hero' ? <MiniBioHero /> : <MiniBioCard />}
+ {type === 'hero' ? <MiniBioHero /> : <MiniBioCard content={miniBio} />}

```

Comenzaremos pasando estos datos al componente **MiniBioCard** y enlazando los datos dentro de este componente.

Primero, definamos la prop:

_./src/pods/mini-bio/components/mini-bio-card.astro_

```diff
---
import ShapeOval from '#assets/shapes/oval.svg';
import ShapeRectangle from '#assets/shapes/rectangle.svg';
+ import type { MiniBio } from '../mini-bio.model';

+ interface Props {
+  content: MiniBio;
+ }
+ const { content } = Astro.props;
---
```

Vamos a hacer una pequeña prueba para confirmar que los datos se reciben correctamente:

````diff
_./src/pods/mini-bio/components/mini-bio-card.astro_

```diff
<section
  class="bg-primary-50 dark:bg-primary-100 relative hidden overflow-clip rounded-2xl p-6 lg:block"
  aria-labelledby="about-me-aside-heading"
>
+  <div class="relative z-10 flex flex-col items-center justify-center gap-6">
+    <h2 class="font-geist w-full font-bold" id="about-me-aside-heading">{content.title}</h2>
+  </div>
````

Le damos caña y comprobamos:

```bash
npm run dev
```

¡Funciona! toca mostrar el resto del contenido y ponerlo bonito:

_./src/pods/mini-bio/components/mini-bio-card.astro_

```diff
---
+ import ContactButtons from '#components/contact-buttons.astro';
---

  <div class="relative z-10 flex flex-col items-center justify-center gap-6">
    <h2 class="font-geist w-full font-bold" id="about-me-aside-heading">{content.title}</h2>

+    <div class="flex flex-col items-center justify-center gap-2 text-center">
+      <div class="h-24 w-24">
+        <img
+          alt={content.imageAlt}
+          class="block h-full w-full rounded-full object-cover"
+          height="80"
+          src={content.image.url}
+          width="80"
+        />
+      </div>
+
+      <span class="text-tbase-500/90 font-bold">{content.name}</span>
+      <span class="text-primary-500 font-semibold">{content.role}</span>
+      <p class="text-sm">
+        {content.description}
+      </p>
+    </div>
+
+    <ContactButtons />
  </div>
```

¡ Ahí lo tenemos! 🎉 — Vamos a hacer lo mismo para el componente **MiniBioHero**.

Si navegas a la página _About_, verás que está vacía. Como ya tenemos la obtención de datos lista, solo necesitamos pasárselo al componente **MiniBioHero**:

_./src/pods/mini-bio/mini-bio.pod.astro_

```diff
- {type === 'hero' ? <MiniBioHero /> : <MiniBioCard content={miniBio} />}
+ {type === 'hero' ? <MiniBioHero content={miniBio} /> : <MiniBioCard content={miniBio} />}
```

Y actualizar el componente _mini-bio-hero.astro_:

_./src/pods/mini-bio/components/mini-bio-hero.astro_

```diff
---
import Hero from '#components/hero.astro';
+ import type { MiniBio } from '../mini-bio.model';

+ interface Props {
+  content: MiniBio;
+ }
+ const { content } = Astro.props;
---

- <Hero ariaLabelledby="about-hero-heading" />
+ <Hero ariaLabelledby="about-hero-heading">
+  <div class="flex flex-col justify-center gap-6 md:flex-row md:gap-10">
+    <div class="h-[120px] w-[120px] md:h-[240px] md:w-[240px]">
+      <img src={content.image.url} alt={content.imageAlt} class="h-full w-full rounded-full object-cover" />
+    </div>
+    <div class="flex max-w-[55ch] flex-1 flex-col justify-center gap-4">
+      <div>
+        <h1 class="text-primary-700 text-5xl font-bold" id="about-hero-heading">{content.name}</h1>
+        <p class="text-primary-500 font-semibold">{content.role}</p>
+      </div>
+      <p>
+        {content.description}
+      </p>
+    </div>
+  </div>
+ </Hero>
```

¿Vemos que tal ha quedado?:

```bash
npm run dev
```

¡ Primer caso resuelto 🎉! — ahora tenemos tanto la **tarjeta mini-bio** como el **mini-bio hero** funcionando con datos en vivo.
