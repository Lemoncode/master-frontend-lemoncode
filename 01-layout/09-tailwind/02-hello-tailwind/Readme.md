# Hola Tailwind

## Boilerplate

Para ahorrar tiempo.

El boiler si funciona de primeras:

Si no en online:

https://stackblitz.com/github/Lemoncode/boiler-tailwind

## Vamos a instalar plugins

Los que recomienda Tailwind:

https://tailwindcss.com/docs/editor-setup

vscode-tailwindcss

Hay otro para ordenar las clases según le gusta a Tailwind :-@ TOC?

## El ejemplo

Tailwind v4 **resetea todos los estilos por defecto**, incluyendo los
tamaños por defecto de los `h1`, `h2`, etc.

Por eso este HTML:

```html
<h1>POR EL PODER DE TAILWIND !!!</h1>
```

No se verá grande. Si queremos un tamaño y estilo concreto, **hay que
definirlo usando utility classes**:

```diff
-  <h1>
+ <h1 class="text-4xl font-bold text-blue-600">
    POR EL PODER DE TAILWIND !!!
  </h1>
```

### ¿Qué hace cada clase?

1.  `text-4xl` → Tamaño grande.
2.  `font-bold` → Texto en negrita.
3.  `text-blue-600` → Color azul tono 600.

Si guardas los cambios y recargas el navegador, verás que el H1 ahora tiene el tamaño, peso y color que le hemos indicado con las utility classes de Tailwind.

¿Y esas combinaciones de utility classes de dónde salen? Pues en versiones antiguas de tailwind se genereban TODAS ! y después se hacía un tree-shaking para quedarnos solo con las que usábamos en nuestro proyecto, como lo oyes te tocaba limpiar par ano acabar con un archivo de CSS de varios megas, es decir a partir de Tailwind v4:

- Tailwind **YA NO genera todas las clases por defecto**.
- Genera **solo las clases que detecta en el código fuente**.
- El escaneo se hace a través de `@source` en tu CSS (no en
  `tailwind.config.js`).

¿Lo vemos en acción? Vamos a hacer un `npm run build`

```bash
npm run build
```

Y en `dist/assets/index-xxxxx.css` verás algo así:

```css
@layer utilities {
  .text-4xl {
    ...;
  }
  .font-bold {
    ...;
  }
  .text-blue-500 {
    ...;
  }
  .underline {
    ...;
  }
}
```

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

Bueno vamos a decirl a Tailwind que ignore el Readme.md para no tener estos problemas.

_./src/styles.css_

```diff
@import "tailwindcss";
+ @source not "../Readme.md";
```

Aquí le estamos diciendo que ignore el Readme.md a la hora de buscar clases usadas en el proyecto.

Por defecto Tailwind ignora los archivos que esténen el .gitignore, y algunos otros, más info:

https://tailwindcss.com/docs/detecting-classes-in-source-files

Ojo fijate que sale en amarillo, vamos a añadir unos settings locales en nuestro proyecto:

_./.vscode/settings.json_

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  }
}
```

Aquí le decimos a Visual Studio Code que trate los archivos CSS como Tailwind CSS, y que nos sugiera clases dentro de strings (entre comillas).

## Configurar estilos por defecto para `<h1>`

Si no quieres escribir siempre `class="text-3xl underline"`, puedes
añadir estilos globales usando `@apply`.

_./src/styles.css_

```diff
@import "tailwindcss";
@source not "../Readme.md";

+ h1 {
+  @apply text-3xl underline text-blue-600;
+ }
```

Aquí le estamos diciendo que aplique las clases `text-3xl` y `underline` a todos los H1.

Vamos a eliminarlo ahora del markup:

_./index.html_

```diff
- <h1 class="text-3xl underline">
+ <h1>
    POR EL PODER DE TAILWIND !!!
  </h1>
```

Pero que pasa si queremos poner el h1 en rojo en vez de azul en una página concreta?

_./index.html_

```diff
- <h1>
+ <h1>Soy un h1 de toda la vida</h1>
- <h1>
+ <h1 class="text-red-600">

    POR EL PODER DE TAILWIND !!!
  </h1>

```

Pues que no lo sobreescribe le da más importancia al estilo global.

**ABRIR F12 INSPECCIONAR Y CLASES**

Otra opción que podemos hacer:

_./src/styles.css_

```diff
@import "tailwindcss";
@source not "../Readme.md";

- h1 {
-  @apply text-3xl underline;
- }
+ @layer base {
+  h1 {
+    @apply text-3xl underline;
+    color: var(--color-blue-600); /* color por defecto */
+  }
+ }
```

Más adelante cubriremos los theme, sigamos por aprender como funciona esto....

**FIN**

### ¿Esto es bueno o malo?

**Sí y no.**

- ✔ Sí: HTML más limpio y semántico.\

- ✔ No repites clases una y otra vez.

- ❌ No: si copias un snippet de otro proyecto Tailwind, el resultado
  visual será distinto.\

- ❌ Se rompe un poco la filosofía "utility-first pura".

> 🎯 No hay bala de plata.\
> Depende de si quieres prioridad en legibilidad o en portabilidad.

Otra opcíon sería definir un _theme_ con los estilos que quieres, esto lo veremos más adelante.

## Aproximaciones

¿Qué enfoques tenemos?

### Minimalista (100% utility-first, recomendado)

No uses `h1 { @apply ... }`.\
Pon siempre clases en el HTML.

### Intermedia (la práctica de muchos equipos)

Define estilos globales para: - `body` - headings - textos base

Y el resto, con utilities.

### Más avanzada

Define tokens con `@theme` para colores, tipografía, espaciado, etc.
