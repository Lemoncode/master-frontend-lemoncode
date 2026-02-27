# PostCSS - Plugins

## 0. Introducción a Plugins de PostCSS

PostCSS es una herramienta basada en plugins. Cada plugin añade funcionalidad específica.
Hay cientos de plugins disponibles, cada uno con su propia configuración y propósito.
Vamos a ver algunos de los plugins más comunes y útiles.

<br />

## 1. Postcss Preset Env

Este plugin permite usar características CSS modernas que aún no son compatibles con todos los navegadores.

- Convierte CSS moderno a CSS compatible según los navegadores que quieras soportar.
- Configurable mediante opciones.
- Incluye autoprefixing automático.
- Soporta características como variables CSS, nesting, custom media queries, etc.
- Muy útil para escribir CSS con sintaxis "futura" hoy.

### 1.1. Instalación

```bash
npm install postcss-preset-env --save-dev
```

### 1.2. Configuración

Necesitamos añadir un archivo `postcss.config.cjs` en la raíz del proyecto y configurar los plugins que vamos a usar.

```js
const postcssPresetEnv = require('postcss-preset-env');
// postcss.config.cjs
module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 1
    })
  ]
};
```

¿Qué estamos haciendo aquí?

- `stage`: Define qué tan experimental es la sintaxis que quieres usar (0-4).
  - 0: Muy experimental
  - 1: Experimental
  - 2: Propuesta
  - 3: Candidate Recommendation
  - 4: Estándar
- `features`: Habilita o deshabilita características específicas.

El nivel uno nos permite usar custom media queries.
Nesting y variables CSS ya están soportadas en la mayoría de navegadores, y están soportadas en el stage 2, que es el valor por defecto.

### 1.3. Uso

En nuestro CSS, vamos a probar algunas características.

```css
h1 {
  text-align: center;
  font-size: 3rem;
  color: #131582;
  user-select: none;
}
```

Si ejecutamos `npm run watch:css` y observamos el archivo `dist/styles.css`, veremos que se han añadido prefijos a user-select.

```css
h1 {
  text-align: center;
  font-size: 3rem;
  color: #131582;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

Ahora vamos a probar a usar nesting.

```diff
-  h1 {
-    text-align: center;
-    font-size: 3rem;
-    color: #131582;
-    user-select: none;
-  }
+.header {
+  background-color: #d6d7fe;
+  padding: 20px 0;

+  h1 {
+    text-align: center;
+    font-size: 3rem;
+    color: #131582;
+    user-select: none;
+  }
+}

```

Para que la sintaxis se vea mejor en VS Code, podemos instalar la extensión "CSS Nesting Syntax Highlighting" y "PostCSS Language Support".

Si guardamos, veremos que el CSS generado es el mismo, pero la sintaxis es más limpia.

```css
.header {
  background-color: #d6d7fe;
  padding: 20px 0;
}

.header h1 {
  text-align: center;
  font-size: 3rem;
  color: #131582;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

Tenemos que tener en cuenta que el nesting no es exactamente igual al de Sass, esto lo veremos en detalle más adelante.

Ahora vamos a probar custom media queries. Esto es algo que no está soportado nativamente en ningún navegador aún. Ni hay ningún navegador que de forma experimental lo soporte. Pero es algo que nos puede ayudar a escribir CSS más limpio y mantenible.

```diff
+@custom-media --bp-md (min-width: 768px);

.header {
  background-color: #d6d7fe;
  padding: 20px 0;

  h1 {
    text-align: center;
    font-size: 3rem;
    color: #131582;
    user-select: none;
+    @media (--bp-md) {
+      font-size: 7rem;
+    }
  }
}

```

Si guardamos, veremos que el CSS generado es:

```css
.header {
  background-color: #d6d7fe;
  padding: 20px 0;
}

.header h1 {
  text-align: center;
  font-size: 3rem;
  color: #131582;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .header h1 {
    font-size: 7rem;
  }
}
```

Vamos a usar variables CSS.

```diff
+:root {
+  --pure-white: rgb(255, 255, 255);
+  --main-color: rgba(86, 32, 18, 1);
+  --light-color: hsl(from var(--main-color) h s calc(l + 70));
+  --surface-color: var(--light-color);
+  --footer-background: var(--main-color);
+  --text-primary: var(--main-color);
+  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
+  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
+}


body {
+  color: var(--text-base);
+  background: var(--surface-color);
}

.header {
-  background-color: #d6d7fe;
  padding: 20px;

  h1 {
    text-align: center;
    font-size: 3rem;
-   color: #131582;
+   color: var(--text-primary);
    user-select: none;
    @media (--bp-md) {
      font-size: 7rem;
    }
  }
}

+.footer {
+  background-color: var(--footer-background);
+  padding: 10px 0;
+  text-align: center;
+  color: var(--text-contrast);
+}
```

Si guardamos, veremos que el CSS generado genera un fallback para los navegadores que no soportan variables CSS:

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
}

.header {
  padding: 20px 0;
}

.header h1 {
  text-align: center;
  font-size: 3rem;
  color: rgba(86, 32, 18, 1);
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .header h1 {
    font-size: 7rem;
  }
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

### 1.4. Documentación

Para más información, consulta la documentación oficial de PostCSS Preset Env:

- [PostCSS Preset Env en GitHub](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env)
- [PostCSS Preset Env en CSSDB](https://preset-env.cssdb.org/)

<br />

## 2. CSS Nano

Este plugin se usa para optimizar y minificar el CSS para producción.

### 2.1 Instalación

```bash
npm install cssnano --save-dev
```

### 2.2 Configuración

Añadimos cssnano a nuestro archivo `postcss.config.cjs`:

```diff
const postcssPresetEnv = require('postcss-preset-env');
+const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 1
    }),
+    cssnano({
+      preset: [
+        'default',
+        {
+          calc: false // Disable calc optimizations to avoid conflicts with relative color syntax
+        }
+      ]
+    })
  ]
};
```

### 2.3 Uso

Ahora, cuando ejecutemos `npm run watch:css` o `npm run build:css`, el CSS generado en `dist/styles.css` estará minificado y optimizado para producción.

```
*,:after,:before{box-sizing:border-box}*{margin:0}img{display:block;max-width:100%}:root{--main-color:#562012;--pure-white:#fff;--light-color:hsl(from var(--main-color) h s calc(l + 70));--surface-color:var(--light-color);--footer-background:var(--main-color);--text-primary:var(--main-color);--text-base:hsl(from var(--main-color) h s calc(l - 15)/0.87);--text-contrast:hsl(from var(--pure-white) h s l/0.7)}body{background:#f7ddd6;background:var(--surface-color);color:rgba(23,8,5,.87);color:var(--text-base);display:flex;flex-direction:column;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;min-height:100svh;min-width:360px}main{flex-grow:1;padding:80px 0}.header{padding:20px 0}.header h1{color:#562012;color:var(--text-primary);font-size:3rem;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none}@media (min-width:768px){.header h1{font-size:7rem}}.footer{background-color:#562012;background-color:var(--footer-background);color:hsla(0,0%,100%,.7);color:var(--text-contrast);padding:10px 0;text-align:center}
```

Para seguir con los ejemplos, vamos a eliminar cssnano de la configuración para que el CSS sea legible mientras desarrollamos. También podemos desinstalarlo si no lo vamos a usar.

_postcss.config.cjs_

```diff
const postcssPresetEnv = require('postcss-preset-env');
-const cssnano = require('cssnano');
+// const cssnano = require('cssnano');
// postcss.config.cjs
module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 1
    }),
-    cssnano({
-      preset: [
-        'default',
-        {
-          calc: false // Disable calc optimizations to avoid conflicts with relative color syntax
-        }
-      ]
-    })
+    // cssnano({
+    //   preset: [
+    //     'default',
+    //     {
+    //       calc: false // Disable calc optimizations to avoid conflicts with relative color syntax
+    //     }
+    //   ]
+    // })
  ]
};
```

### 2.4 Documentación

Documentación oficial: [https://cssnano.github.io/cssnano/](https://cssnano.github.io/cssnano/)
