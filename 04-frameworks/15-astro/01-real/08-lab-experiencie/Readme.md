# 08 Laboratorio de Experiencia

Hemos aprendido un montón de cosas... Es hora de prácticar un poco, mi consejo es que en cuando lea el enunciado de esta demo, le des a la pausa y vayas completando este desafió siguiendo la guía que acompaña al video, después nos pondremos paso a implementarlo para que compruebes que todo ha ido bien.

## Descripción general del laboratorio

Si haces clic en la página _About_, verás una página vacía. Nuestro objetivo es mostrar allí la lista de experiencia laboral del usuario.

Usaremos el conocimiento adquirido en los módulos anteriores para implementar esta funcionalidad.

## Objetivo

Si ejecutamos el proyecto

```bash
npm run dev
```

Y hacemos click en la página _About_, deberías ver una página vacía.

![Marcador de posición de experiencia vacía](./content/empty-experience.jpg)

Nuestro objetivo es mostrar algo como esto:

![Lista completa de experiencias](./content/experience-completed.jpg)

Así que mi c

## Cargando datos

Ya tenemos nuestro proyecto conectado a **Content Island**.

Al observar el modelo, podemos ver que incluye tanto una lista de experiencias como un modelo **Experience**.

![Experience y el modelo Experience](./content/model.jpg)

Vamos a cargar los datos desde Content Island.

Tenemos disponible un pod llamado _experience-collection_.

Definimos un modelo. En Content Island tenemos:

- Un modelo **Experience Section** que carga todas las experiencias más el encabezado de la sección.
- Un modelo **Experience** que representa una sola experiencia.

En Content Island puedes generar un modelo que incluya colecciones anidadas. Creamos un nuevo archivo y pegamos la definición del modelo de Content Island (esto lo puedes copiar de la guía).

_./src/pods/experience-collection/experience-collection.model.ts_

```ts
export interface Experience {
  id: string;
  language: "en";
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ExperienceSection {
  id: string;
  language: "en";
  title: string;
  experienceCollection: Experience[];
}
```

Ahora carguemos los datos desde Content Island. Esta vez, indicaremos que queremos cargar la colección anidada (con la bandera **includeRelatedContent** configurada en `true`).

Necesitamos crear un nuevo archivo para la llamada a la API, llamado **experience-collection.api.ts**, dentro de la carpeta _experience-collection_.

_./src/pods/experience-collection/experience-collection.api.ts_

```ts
import client from "#lib/client.ts";
import type { ExperienceSection } from "./experience-collection.model";

export const getExperience = async () =>
  await client.getContent<ExperienceSection>({
    contentType: "ExperienceSection",
    includeRelatedContent: true,
  });
```

Ahora lo usaremos dentro de nuestro componente:

_./src/pods/experience-collection/experience-collection.pod.astro_

```diff
---
- const experienceContent = {
-  title: 'Experience',
- };
+ import { getExperience } from "./experience-collection.api";
+ const experienceContent = await getExperience();
---

<section class="flex flex-1 flex-col gap-10 px-6" aria-labelledby="experience-section-heading">
-  <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>
+ <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>
+  <ul>
+    {experienceContent.experienceCollection.map((experience) => (
+      <li>
+        <p>{experience.role} @ {experience.company}</p>
+        <p>{experience.period}</p>
+        <p>{experience.description}</p>
+      </li>
+    ))}
+  </ul>
</section>
```

Si ahora vas a la página _About_, deberías ver una lista de experiencias (aún sin diseño).

## Agregando estilos

Toca estilar nuestro componente:

```diff
<section class="flex flex-1 flex-col gap-10 px-6" aria-labelledby="experience-section-heading">
  <h2 class="text-tbase-500/90 text-3xl font-bold" id="experience-section-heading">{experienceContent.title}</h2>

-  <ul>
-    {experienceContent.experienceCollection.map((experience) => (
-      <li>
-        <p>{experience.role} @ {experience.company}</p>
-        <p>{experience.period}</p>
-        <p>{experience.description}</p>
-      </li>
-      ))}
-  </ul>
+  <div class="pl-4">
+    {
+      experienceContent.experienceCollection.map(exp => (
+        <div class="relative flex items-baseline gap-4 before:absolute before:top-5 before:left-[5px] before:z-[-1] before:h-full before:w-0.5 before:bg-gray-300 last:before:hidden">
+          <div class="flex flex-col">
+            <div class="bg-primary-700 dark:border-primary-50 dark:shadow-primary-50 h-3 w-3 rounded-full shadow-[0_0_0_4px] shadow-white dark:shadow-[0_0_0_5px]" />
+          </div>
+
+          <article class="pb-10">
+            <h3 class="text-primary-700 text-lg font-bold">
+              {exp.company} – {exp.role}
+            </h3>
+            <span class="text-tbase-500/90 mb-2 block text-sm font-semibold">{exp.period}</span>
+            <p>{exp.description}</p>
+          </article>
+        </div>
+      ))
+    }
+  </div>
</section>
```

```astro
  <div class="pl-4">
    {
      experienceContent.experienceCollection.map(exp => (
        <div class="relative flex items-baseline gap-4 before:absolute before:top-5 before:left-[5px] before:z-[-1] before:h-full before:w-0.5 before:bg-gray-300 last:before:hidden">
          <div class="flex flex-col">
            <div class="bg-primary-700 dark:border-primary-50 dark:shadow-primary-50 h-3 w-3 rounded-full shadow-[0_0_0_4px] shadow-white dark:shadow-[0_0_0_5px]" />
          </div>

          <article class="pb-10">
            <h3 class="text-primary-700 text-lg font-bold">
              {exp.company} – {exp.role}
            </h3>
            <span class="text-tbase-500/90 mb-2 block text-sm font-semibold">{exp.period}</span>
            <p>{exp.description}</p>
          </article>
        </div>
      ))
    }
  </div>
```

Y... ¡ Ya lo tenemos ! ¿Qué te ha parecido?

En el siguiente video, tenemos una demo de "bonus", vamos a ver como funciona el server side rendering y el server streaming.
