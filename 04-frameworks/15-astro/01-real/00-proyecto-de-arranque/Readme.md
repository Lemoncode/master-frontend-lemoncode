# Proyecto Real

Hasta ahora hemos estado trabajando con ejemplos sencillos para entender los conceptos básicos de Astro y Content Island, toca simular un proyecto real: la idea es que nos incorporamos a un proyecto a medio construir y nos asignan diferentes casos, así aprovechamos para:

- Ver como aplicar los conceptos aprendidos en un proyecto más grande.
- Aprender otros conceptos más avanzados como:
  - Implementar un Client Island.
  - Implementar server actions.

## El Sitio

El proyecto sobre el que vamos a trabajar es el que ves en pantalla:

https://stackblitz.com/github/content-island/workshop-final-step

![Proyecto completo, colección de blog, mini sección "Acerca
de"](./content/01-full-project.jpg)

Incluye:

-   Una página principal que muestra una lista de post.
-   Una página de post que muestra el contenido de un post.
-   Una página completa "Acerca de" que presenta la experiencia laboral del
    autor del sitio web.

> Por cierto, si te gustaría aprovechar este proyecto para crear tu propio sitio personal, que sepas que en Content Island puedes crearte una cuenta gratuita y tenemos una plantilla lista para usar que puedes clonar y personalizar fácilmente.

Nuestro punto de partida se ve así:

https://stackblitz.com/github/content-island/workshop-start-step

![Captura del proyecto inicial vacío, sin lista de publicaciones, sin
tarjeta "acerca de"](./content/02-empty-starter.jpg)

LA SOLUCIÓN FINAL:

https://stackblitz.com/github/content-island/workshop-final-step


## Configuración

Vamos a explorar la estructura del proyecto.

Clonamos nuestro proyecto inicial, puedes encontrarlo en esta URL:

https://github.com/content-island/workshop-start-step

Instalamos las dependencias

``` bash
npm i
```

Y ejecutamos el proyecto inicial

``` bash
npm run dev
```

## Estructura

Aquí tienes una visión general de las carpetas principales en la raíz del proyecto:

-   **Assets**: Imágenes, fuentes y otros recursos estáticos.
-   **Styles**: Estilos globales y configuración de Tailwind.
-   **Components**: Bloques reutilizables que pueden usarse en
    diferentes páginas.
-   **Layouts**: Como vimos en los ejemplos básicos, los layouts
    envuelven las páginas con una estructura compartida. En este
    proyecto también usamos **slots con nombre**, lo que los hace más
    flexibles.
-   **Pages**: Las páginas reales de la aplicación, compuestas usando
    layouts y componentes.
-   **Pods**: En estos pods encapsulamos islas de funcionalidad, con un dominio acotado y aislado, cada pod tiene sus propios componentes, servicios y modelos.

> A tener en cuenta, esto de los pods, no es algo de Astro, es una forma de organizar el código que nos gusta usar para mantener el proyecto ordenado y modular, y puedes aplicarlos en otras tecnologías también.

> Igual te estás preguntando *¿Por qué no ponemos todo dentro de la carpeta **pages**?*\
> El tema es que Astro trata cada archivo en **pages** como una ruta potencial. Si
> colocas componentes allí, Astro podría renderizarlos por error como
> páginas. Puedes evitarlo agregando un guion bajo al nombre del
> archivo, pero es más limpio y mantenible mantener las cosas
> organizadas en sus propias carpetas.\
> Puedes consultar la documentación para más detalles:
> https://docs.astro.build/en/guides/routing/#excluding-pages

En el archivo **astro.config.mjs**, hemos agregado el plugin **tailwindcss** (Astro proporciona un comando CLI para instalarlo fácilmente).

Como puedes ver, hemos añadido @ts-check y la sección de plugins aparece en rojo; podemos eliminar eso:

``` diff
export default defineConfig({
  vite: {
-    plugins:  [tailwindcss()],
+    plugins: /** @type {any} */ ([tailwindcss()]),
  },
});
```

Más info sobre como instalar Tailwind en Astro aquí: https://docs.astro.build/en/guides/styling/#tailwind

Finalmente, el archivo **tsconfig.json** configura TypeScript. En este
proyecto, lo usamos para definir alias de rutas, de modo que podamos
importar módulos con el prefijo `#/` en lugar de rutas relativas largas.

# Ejemplos

¿Qué te parece? ¿Tienes ganas de hincarle el diente? Pues nos ponemos con los ejemplos; empezaremos con algo simple y lo iremos evolucionando (primero actualizaremos un componente, luego un pod, después una página, y así sucesivamente...).
