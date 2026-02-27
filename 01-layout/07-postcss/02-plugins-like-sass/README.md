# Plugins de PostCSS para escribir CSS parecido a Sass

Vamos a ver cómo usar PostCSS para escribir CSS con características similares a las de Sass, como nesting, variables, mixins e imports.

## 1. PostCSS Import

Este plugin permite importar archivos CSS dentro de otros archivos CSS, similar a `@import` en Sass.

### 1.1 Instalación

```bash
npm install postcss-import --save-dev
```

### 1.2 Configuración

_postcss.config.cjs_

```diff
+ const postcssImport = require('postcss-import');

module.exports = {
  plugins: [
+    postcssImport(),
     postcssPresetEnv({
      stage: 1
     })
  ]
};
```

### 1.3 Uso

Creamos un archivo `variables.css` en `src/`:

```css
:root {
  --main-color: rgba(86, 32, 18, 1);
  --pure-white: rgb(255, 255, 255);
  --light-color: hsl(from var(--main-color) h s calc(l + 70));
  --surface-color: var(--light-color);
  --footer-background: var(--main-color);
  --text-primary: var(--main-color);
  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
}
```

Luego, en nuestro archivo `styles.css`, importamos las variables:

```diff
+@import 'variables.css';


- :root {
-  --main-color: rgba(86, 32, 18, 1);
-  --pure-white: rgb(255, 255, 255);
-  --light-color: hsl(from var(--main-color) h s calc(l + 70));
-  --surface-color: var(--light-color);
-  --footer-background: var(--main-color);
-  --text-primary: var(--main-color);
-  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
-  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
-}
```

Podemos ver como en el CSS generado, las variables están disponibles en el archivo principal.

```css
:root {
  --main-color: rgba(86, 32, 18, 1);
  --pure-white: rgb(255, 255, 255);
  --light-color: hsl(from var(--main-color) h s calc(l + 70));
  --surface-color: var(--light-color);
  --footer-background: var(--main-color);
  --text-primary: var(--main-color);
  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
...
```

### 1.4 Documentación

Documentación: [https://github.com/postcss/postcss-import](https://github.com/postcss/postcss-import)

<br />

## 2. PostCSS Nested

Este plugin permite usar nesting en CSS, similar a Sass. Podemos usar parte del nombre de una clase con `&`. Al usar BEM, podemos aprovechar esto para anidar los elementos hijos.

### 2.1 Instalación

```bash
npm install postcss-nested --save-dev
```

### 2.2 Configuración

_postcss.config.cjs_

```diff
+ const postcssNested = require('postcss-nested');

module.exports = {
  plugins: [
     postcssImport(),
+    postcssNested(),
     postcssPresetEnv({
      stage: 1
     })
     ...
  ]
};
```

### 2.3 Uso

_variables.css_

```diff
:root {
+  --border-color: hsl(from var(--main-color) h s calc(l + 10));
}
```

_styles.css_

```diff

main {
+  display: flex;
+  align-items: center;
}

.header {
  padding: 20px 0;
-  h1 {
+  &__title {
    text-align: center;
    font-size: 3rem;
    color: var(--text-primary);
    user-select: none;
    @media (--bp-md) {
      font-size: 7rem;
    }
  }
}

+.section {
+  max-width: 800px;
+  margin: 0 auto;
+  padding: 40px;
+  border: 2px solid var(--border-color);
+  border-radius: 12px;
+  display: flex;
+  flex-direction: column;
+  justify-content: center;
+  align-items: center;
+  text-align: center;
+  gap: 20px;
+  &__image-container {
+    max-width: 400px;
+    border: 2px solid var(--border-color);
+    padding: 24px 16px 56px 16px;
+    border-radius: 12px;
+  }
+  &__image {
+    border-radius: 8px;
+  }
+}

```

Con el CSS generado, podemos ver como las reglas anidadas se han expandido correctamente:

```css
:root {
  --main-color: rgba(86, 32, 18, 1);
  --pure-white: rgb(255, 255, 255);
  --light-color: hsl(from var(--main-color) h s calc(l + 70));
  --surface-color: var(--light-color);
  --footer-background: var(--main-color);
  --text-primary: var(--main-color);
  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
  --border-color: hsl(from var(--main-color) h s calc(l + 10));
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}

body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif;
  min-width: 360px;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  color: rgba(23, 8, 5, 0.87);
  color: var(--text-base);
  background: rgb(247, 221, 214);
  background: var(--surface-color);
}

main {
  flex-grow: 1;
  padding: 80px 0;
  display: flex;
  align-items: center;
}

.header {
  padding: 20px 0;
}

.header__title {
  text-align: center;
  font-size: 3rem;
  color: rgba(86, 32, 18, 1);
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .header__title {
    font-size: 7rem;
  }
}

.section {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid rgb(128, 48, 27);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.section__image-container {
  max-width: 400px;
  border: 2px solid rgb(128, 48, 27);
  border: 2px solid var(--border-color);
  padding: 24px 16px 56px 16px;
  border-radius: 12px;
}

.section__image {
  border-radius: 8px;
}

.footer {
  background-color: rgba(86, 32, 18, 1);
  background-color: var(--footer-background);
  padding: 10px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  color: var(--text-contrast);
}
```

### 2.4 Diferencia con el nesting nativo de CSS

Una diferencia importante entre el nesting nativo de CSS y PostCSS Nested es el impacto en la especificidad. Cuando usamos `&` con metodología BEM, PostCSS Nested genera CSS con menor especificidad, ya que no repite el selector padre en cada regla hija.

**Ejemplo de especificidad:**

- Nesting nativo: `0-1-1` (repite el selector padre)
- PostCSS Nested con `&`: `0-1-0` (no repite el selector padre)

Aunque la diferencia es mínima en este caso, se vuelve más significativa cuando anidamos múltiples clases.

> **Nota sobre extensiones de VS Code:** La extensión "PostCSS Language Support" puede interferir con la visualización de especificidad al pasar el cursor sobre las clases. Como alternativa, se recomienda usar "PostCSS Intellisense and Highlighting", que mantiene la funcionalidad de especificidad y es compatible con PostCSS.

### 2.5 Documentación

Documentación: [https://github.com/postcss/postcss-nested](https://github.com/postcss/postcss-nested)

<br />

## 3. PostCSS Simple Vars

Este plugin permite usar variables en CSS, similar a Sass. A diferencia de las variables CSS nativas, estas variables se reemplazan en tiempo de compilación, por lo que son compatibles con todos los navegadores.

### 3.1 Instalación

```bash
npm install postcss-simple-vars --save-dev
```

### 3.2 Configuración

_postcss.config.cjs_

```diff
+ const simpleVars = require('postcss-simple-vars');

module.exports = {
  plugins: [
    postcssImport(),
+   simpleVars(),
    postcssNested(),
    postcssPresetEnv({
      stage: 1
    })
  ]
};
```

### 3.3 Uso

_variables.css_

```diff
+$md: 768px;
```

_styles.css_

```diff
-@custom-media --bp-md (min-width: 768px);
+@custom-media --bp-md (min-width: $md);
```

Podemos ver como en el CSS generado, la variable `$md` se ha reemplazado por `768px`.

```css
.header {
  padding: 20px 0;
}

.header__title {
  text-align: center;
  font-size: 3rem;
  color: rgba(86, 32, 18, 1);
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .header__title {
    font-size: 7rem;
  }
}
```

Este es un ejemplo que no se puede hacer con las variables nativas de CSS, ya que no se pueden usar dentro de `@custom-media`.

### 3.4 Documentación

Documentación: [https://github.com/postcss/postcss-simple-vars](https://github.com/postcss/postcss-simple-vars)

<br />

## 4. PostCSS Mixins

Este plugin permite usar mixins en CSS, similar a Sass.

### 4.1 Instalación

```bash
npm install postcss-mixins --save-dev
```

### 4.2 Configuración

_postcss.config.cjs_

```diff
+ const mixins = require('postcss-mixins');
module.exports = {
  plugins: [
    postcssImport(),
    simpleVars(),
+   mixins(),
    postcssNested(),
    postcssPresetEnv({
      stage: 1
    })
  ]
};
```

### 4.3 Ejemplos

Creamos un nuevo archivo `mixins.css` en `src/`:

```css
@define-mixin hover {
  @media (hover: hover) {
    &:hover {
      @mixin-content;
    }
  }
}
```

Luego, en nuestro archivo `styles.css`, importamos los mixins y los usamos:

```diff
+@import 'mixins.css';

.header{
  &__image {
    border-radius: 8px;
    transition: transform 0.3s ease;
+    @mixin hover {
+      transform: scale(1.5);
+    }
  }
}
```

Podemos ver como en el CSS generado, el mixin `hover` se ha expandido correctamente:

```css
.section__image {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

@media (hover: hover) {
  .section__image:hover {
    transform: scale(1.5);
  }
}
```

Vamos con otro ejemplo de mixin con parámetros.

_mixins.css_

```diff
+ @define-mixin pseudo $width, $height {
+   display: block;
+   content: '';
+   position: absolute;
+   width: $(width);
+   height: $(height);
+   @mixin-content;
+ }
```

_variables.css_

```diff
:root {
+  --border-page-color: hsl(from var(--main-color) h s calc(l + 60));
}
```

_styles.css_

```diff
.section {
+  --pseudo-size: 60px;
+  --section-padding: 40px;
  max-width: 800px;
  margin: 0 auto;
+  padding: var(--section-padding);
+  padding-left: calc(var(--section-padding) - 10px + var(--pseudo-size));
  border: 2px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
+  position: relative;

+  &::before {
+    @mixin pseudo var(--pseudo-size), 100% {
+      z-index: -1;
+      top: 0;
+      left: 0px;
+      border-radius: 8px 0 0 8px;
+      background: radial-gradient(
+          circle at 40% 50%,
+          transparent 7px,
+          var(--border-color) 8px,
+          var(--border-color) 9px,
+          transparent 10px
+        ), var(--border-page-color);
+      background-size: 100% 25%;
+      background-repeat: repeat-y;
+    }
+  }
}
```

Podemos ver como en el CSS generado, el mixin `pseudo` se ha expandido correctamente con los parámetros pasados:

```css
.section::before {
  display: block;
  content: '';
  position: absolute;
  width: var(--pseudo-size);
  height: 100%;
  z-index: -1;
  top: 0;
  left: 0px;
  border-radius: 8px 0 0 8px;
  background: radial-gradient(
      circle at 40% 50%,
      transparent 7px,
      rgb(128, 48, 27) 8px,
      rgb(128, 48, 27) 9px,
      transparent 10px
    ), rgb(238, 186, 172);
  background: radial-gradient(
      circle at 40% 50%,
      transparent 7px,
      var(--border-color) 8px,
      var(--border-color) 9px,
      transparent 10px
    ), var(--border-page-color);
  background-size: 100% 25%;
  background-repeat: repeat-y;
}
```

### 4.4 Documentación

Documentación: [https://github.com/postcss/postcss-mixins](https://github.com/postcss/postcss-mixins)

<br />

## 5. Conclusión

Existen muchos más plugins de PostCSS, los podéis explorar en el [sitio oficial de plugins de PostCSS](https://www.postcss.parts/). Pero recomiendo usar los creados por el equipo de PostCSS, ya que suelen estar mejor mantenidos y actualizados.
