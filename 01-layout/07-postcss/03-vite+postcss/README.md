# PostCSS with Vite

## Introducción

PostCSS está integrado en Vite de forma predeterminada. Usando por defecto postcss-import y autoprefixer. Puedes personalizar la configuración de PostCSS creando un archivo `postcss.config.cjs` en la raíz de tu proyecto. E instalar los plugins que necesites.

Creamos un nuevo proyecto Vite con soporte para PostCSS y TypeScript:

```bash
npm create vite@latest my-postcss-vite-app -- --template vanilla-ts
```

Navegamos a la carpeta del proyecto e instalamos los plugins de PostCSS que vamos a utilizar:

```bash
cd my-postcss-vite-app
npm install -D postcss-preset-env postcss-simple-vars postcss-mixins postcss-nested
npm install -D @types/postcss-preset-env
```

## Ejemplo de configuración

Creamos el archivo `postcss.config.cjs` en la raíz del proyecto con el siguiente contenido:

```js
const postcssPresetEnv = require('postcss-preset-env');
const simpleVars = require('postcss-simple-vars');
const postcssMixins = require('postcss-mixins');
const postcssNested = require('postcss-nested');

module.exports = {
  plugins: [
    simpleVars(),
    postcssMixins(),
    postcssNested(),

    /* other plugins */
    /* remove autoprefixer if you had it here, it's part of postcss-preset-env */
    postcssPresetEnv({
      /* pluginOptions */
      stage: 1
    })
  ]
};
```

Limpiamos el archivo `style.css`, y lo dejamos vacío.
Limpiamos también el archivo `main.ts`, dejándo sólo el import del CSS.
Creamos una carpeta `css` dentro de `src` y movemos el archivo `style.css` a esa carpeta.
Actualizamos el import en `main.ts` para que apunte a la nueva ubicación del CSS:

```ts
import './css/style.css';
```

Ahora vamos a traernos a este proyecto el contenido `index.html` y todos los archivos CSS que teníamos en el proyecto anterior de PostCSS puro.
