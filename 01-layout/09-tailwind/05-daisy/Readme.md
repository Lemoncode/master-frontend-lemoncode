# Daisy UI

## Intro

Esto de ir soltando un montón de clases de Tailwind puede llegar a ser tela de caótico, y empezar tu a crear tus propias clases utilitarias te puede dar la impresión de que estás reinventando la rueda.

Para evitar esto, existen librerías de componentes ya creados con Tailwind, y una de las más populares es Daisy UI que no esta atada a ningún framework y no tiene lógica implementada.

Otra opción es irte a shadcn/ui que es un conjunto de componentes creados con Tailwind y React, pero en este caso ya tienes que usar React, y su aproximación es "curiosa" porque en realidad son componentes de Radix UI estilizados con Tailwind, es decir te bajas los componentes a tu local y los desconectas.

Cómo todavía no hemos visto React, nos centraremos en Daisy UI, y te digo igual es una buena opción, sobre todo para no depender de una tecnología en concreto.

Además el proyecto es open source, y licencia MIT.

La web:

https://daisyui.com/

La paleta de componentes (pinchar en Components).

## Instalando

Vamos a instalar la librería:

```bash
npm i -D daisyui@latest
```

Borramos todo lo que hay en el css, sólo dejamos las dos primera líneas:

_./src/style.css_

```css
@import "tailwindcss";
@source not "../Readme.md";
```

Y vamos a configurar Tailwind para que use Daisy UI.

_./src/style.css_

```diff
@import "tailwindcss";
@source not "../Readme.md";
+ @plugin "daisyui";
```

> Si usas un framework como React, Angular o Astro, hay instrucciones específicas en la web de Daisy UI.

## Ejemplo formulario

Vamos a reemaplzar el formulario que hicimos en el proyecto de Tailwind por uno usando Daisy UI.

_./index.html_

```diff
      <h1 class="text-[--h1-size] leading-[--h1-line] underline">
        POR EL PODER DE TAILWIND !!!
      </h1>
-      <div class="min-h-screen bg-gray-100 flex items-center justify-center">
-        <form class="form-container">
-          <h2 class="text-2xl font-semibold text-gray-800 mb-2">
-            Formulario de contacto
-          </h2>
-          <!-- Nombre -->
-          <div>
-            <label for="nombre" class="form-label">Nombre</label>
-            <input
-              type="text"
-              id="nombre"
-              name="nombre"
-              class="form-input"
-              placeholder="Tu nombre"
-            />
-          </div>
-
-          <!-- Email -->
-          <div>
-            <label for="email" class="form-label">Email</label>
-            <input
-              type="email"
-              id="email"
-              name="email"
-              class="form-input"
-              placeholder="tucorreo@ejemplo.com"
-            />
-          </div>
-
-          <!-- Mensaje -->
-          <div>
-            <label for="mensaje" class="form-label">Mensaje</label>
-            <textarea
-              id="mensaje"
-              name="mensaje"
-              rows="4"
-              class="form-input"
-              placeholder="Tu mensaje..."
-            ></textarea>
-          </div>
-
-          <button type="submit" class="btn-primary">Enviar</button>
-        </form>
-      </div>
  </div>
</div>
```

El markup completo (colocar dentro de div id="app" y justo debajo del h1):

```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content container max-w-md">
    <div class="card w-full bg-base-100 shadow-xl p-8 space-y-6">
      <h2 class="text-3xl font-bold text-center">Formulario de contacto</h2>

      <!-- Nombre -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Nombre</span>
        </div>
        <input
          type="text"
          placeholder="Tu nombre"
          class="input input-bordered w-full"
        />
      </label>

      <!-- Email -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <input
          type="email"
          placeholder="tucorreo@ejemplo.com"
          class="input input-bordered w-full"
        />
      </label>

      <!-- Mensaje -->
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Mensaje</span>
        </div>
        <textarea
          class="textarea textarea-bordered w-full"
          rows="4"
          placeholder="Escribe tu mensaje..."
        ></textarea>
      </label>

      <!-- Botón -->
      <button class="btn btn-primary w-full">Enviar</button>
    </div>
  </div>
</div>
```

## Customizando

Si quiero customizar un elemento solo tengo que poner clases de Tailwind encima de las clases de Daisy UI, por ejemplo si quiero que el botón sea tenga otro color:

```diff
- <button class="btn btn-primary w-full">
+ <button class="btn w-full bg-green-600 hover:bg-green-700 border border-green-600 text-white">
   Enviar
 </button>
```

## Tematizando

### Colores

Antes que tematizar, es interesante ver que ofrece una paleta de colores predefinidos que está muy bien:

https://daisyui.com/docs/colors/

Ahora veamos como tematizar:

Por ejemplo si volvemos al ejemplo de btn-primary:

```html
<button class="btn btn-primary w-full">Enviar</button>
```

Vamos a cambiar por error:

```diff
- <button class="btn btn-primary w-full">
+ <button class="btn btn-error w-full">
  Enviar
</button>
```

### Tematizado

Daisy UI viene con 35 temas predefinidos, que puedes ver aquí:

https://daisyui.com/docs/themes/

Y puedes tener más de uno y cambiarlos dinámicamente.

Vamos a probar el cupcake por ejemplo:

_./src/style.css_

```diff
@import "tailwindcss";
@source not "../Readme.md";
- @plugin "daisyui";
+ @plugin "daisyui" {
+   themes: cupcake --default;
+}
```

Y en el html

_./index.html_

```diff
<!DOCTYPE html>
- <html lang="en">
+ <html lang="en" data-theme="cupcake">
```

Vamos a probarlo.

## Creando un tema propio

Y ahora tenemos lo típico, tu empresas tiene sus colores, etc... una opción es ir en modo "Bilbao" y crear tu tema completo:

Dejamos sólo esto en el css

```css
@import "tailwindcss";
@source not "../Readme.md";
```

Y metemos lo siguiente en el css:

```css
@plugin "daisyui/theme" {
  name: "mytheme";
  default: true; /* set as default */
  prefersdark: false; /* set as default dark mode (prefers-color-scheme:dark) */
  color-scheme: light; /* color of browser-provided UI */

  --color-base-100: oklch(98% 0.02 240);
  --color-base-200: oklch(95% 0.03 240);
  --color-base-300: oklch(92% 0.04 240);
  --color-base-content: oklch(20% 0.05 240);
  --color-primary: oklch(55% 0.3 240);
  --color-primary-content: oklch(98% 0.01 240);
  --color-secondary: oklch(70% 0.25 200);
  --color-secondary-content: oklch(98% 0.01 200);
  --color-accent: oklch(65% 0.25 160);
  --color-accent-content: oklch(98% 0.01 160);
  --color-neutral: oklch(50% 0.05 240);
  --color-neutral-content: oklch(98% 0.01 240);
  --color-info: oklch(70% 0.2 220);
  --color-info-content: oklch(98% 0.01 220);
  --color-success: oklch(65% 0.25 140);
  --color-success-content: oklch(98% 0.01 140);
  --color-warning: oklch(80% 0.25 80);
  --color-warning-content: oklch(20% 0.05 80);
  --color-error: oklch(65% 0.3 30);
  --color-error-content: oklch(98% 0.01 30);

  /* border radius */
  --radius-selector: 1rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;

  /* base sizes */
  --size-selector: 0.25rem;
  --size-field: 0.25rem;

  /* border size */
  --border: 1px;

  /* effects */
  --depth: 1;
  --noise: 0;
}
```

Y en el HTML

```html
<!DOCTYPE html> -
<html lang="en" data-theme="cupcake">
  +
  <html lang="en" data-theme="mytheme"></html>
</html>
```

## Customizando un tema

Seamos más realistas... lo normal es que queramos usar los cuatro colores corporativos, ¿Por qué no cambiar justo eso y ya está? Podemos elegir un tema y customizar esos colores.

Borramos el custom theme y vuelta a empezar

_./src/style.css_

```css
@import "tailwindcss";
@source not "../Readme.md";
@plugin "daisyui";
@plugin "daisyui/theme" {
  name: "light";
  default: true;
  --color-primary: blue;
  --color-secondary: teal;
}
```

En el HTML elegimos el tema "light"

```diff
<!DOCTYPE html>
- <html lang="en" data-theme="mytheme">
+ <html lang="en" data-theme="light">
  <head>
```

Y jugando con el botón podemos ver cambios (probar uno por uno lo cambios):

```diff
-  <button class="btn btn-error w-full">Enviar</button>
+  <button class="btn btn-primary w-full">Enviar</button>
+  <button class="btn btn-seconday w-full">Enviar</button>
```
