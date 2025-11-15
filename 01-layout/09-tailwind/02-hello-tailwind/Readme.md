# Hola Tailwind

Si te fijas aunque ponemos un H1 en el HTML, este no se ve con el tamaño y estilo por defecto de los navegadores, Tailwind lo resetea ¡ TODO !

Así que si queremos que ese H1 tenga un tamaño y estilo concreto, tenemos que decírselo nosotros, usando utility classes.

En el main haríamos algo así como:

```diff
-  <h1>
+ <h1 class="text-4xl font-bold text-blue-600">
    POR EL PODER DE TAILWIND !!!
  </h1>
```

¿Qué estamos haciendo aquí?

1. `text-4xl`: Le estamos diciendo que el tamaño del texto sea 4 veces extra grande.

2. `font-bold`: Le estamos diciendo que el peso de la fuente sea negrita (bold).

3. `text-blue-600`: Le estamos diciendo que el color del texto sea azul, en su tonalidad 600 (Tailwind tiene una escala de colores del 100 al 900).

Si guardas los cambios y recargas el navegador, verás que el H1 ahora tiene el tamaño, peso y color que le hemos indicado con las utility classes de Tailwind.

¿Y esas combinaciones de utility classes de dónde salen? Pues en versiones antiguas de tailwind se genereban TODAS ! y después se hacía un tree-shaking para quedarnos solo con las que usábamos en nuestro proyecto, como lo oyes te tocaba limpiar par ano acabar con un archivo de CSS de varios megas.

En la versiones más modernas se da la vuelta a la tortilla: El plugin de Tailwind se pone a analizar nuestro código fuente (HTML, JS, etc) y va generando SOLO las clases que usamos en nuestro proyecto.

¿Lo vemos en acción? Vamos a hacer un `npm run build`

```bash
npm run build
```

Y abrimos el archivo `dist/assets/index-XXXXX.css` (abrimos y le damos a save para que prettier lo formatee), y debajo de `@layer utilities` verás que solo contiene las clases que hemos usado en nuestro proyecto.

> HOSTIS !!! PUES NO, HAY UN MONTON MAS DE CLASES !!! ¿Qué está pasando aquí? Pues mira que "mojonazo" que el plugin está pillando las del Readme.md jajajajaj. Si borramos el contenido del Readme.md y volvemos a hacer un build, veremos que solo quedan las clases que hemos usado en el index.html

```css
@layer utilities {
  .text-4xl {
    font-size: var(--text-4xl);
    line-height: var(--tw-leading, var(--text-4xl--line-height));
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .text-blue-500 {
    color: var(--color-blue-500);
  }
  .underline {
    text-decoration-line: underline;
  }
}
```

Vamos a hacer una prueba rápida, modificamos el estilo inline del H1 y volvemos a hacer un build:

```diff
- <h1 class="text-4xl font-bold text-blue-600">
+ <h1 class="text-3xl underline">
```

Si no está el Readme verás que en el CSS generado solo aparecen las clases `text-3xl` y `underline`.

Vamos a crearmos un fichero _tailwind.config.js_ para indicarle al plugin que no mire en el Readme.

_tailwind.config.js_

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js,tsx,jsx,astro,html}"],
};
```
