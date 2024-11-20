# Contenido dinámico

Vamos con la chicha :), añadimos contenido dinámico a nuestro HTML.

# Manos a la obra

¿Te acuerdas de la parte que metíamos entre rejas en nuestros ficheros astro? Pues vamos a añadir contenido dinámico a nuestro HTML.

En el fichero `./src/pages/about.astro` añadimos una variable que va a tener el título de la página:

_./src/pages/about.astro_

```diff
+ ---
+ const pageTitle = "Acerca de dinámico";
+ ---
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
-		<title>Acerca de</title>
+   <title>{pageTitle}</title>
	</head>
	<body>
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
    <a href="/about/">About</a>

-    <h1>Acerca de...</h1>
+    <h1>{pageTitle}</h1>
```

Si ejecutas verás que ahora en about tanto en el título como en el h1 pone "Acerca de dinámico".

> Un tema interesante, si te equivocas tecleando _pageTitle_ en la parte de _HTML_ verás que te avisa y se marca en rojo.

Esto podríamos añadirlo también al resto de páginas.

Ahora vamos a picar código TypeScript "entre rejas" en nuestro fichero astro.

Vamos a añadir un objeto con los datos del usuario y un array de skills

_./src/pages/about.astro_

```diff
---
 const pageTitle = "Acerca de dinámico";

+  const identity = {
+    firstName: "Sarah",
+    country: "Canada",
+    occupation: "Technical Writer",
+    hobbies: ["photography", "birdwatching", "baseball"],
+  };
+
+  const skills = ["HTML", "CSS", "JavaScript", "React", "Astro", "Writing Docs"];
---
<html lang="en">
```

Pero.... oye estamos en TypeScript, ¿Por qué no tipamos identity y skills? Vamos a ello :).

_./src/pages/about.model.ts_

```typescript
export interface Identity {
  firstName: string;
  country: string;
  occupation: string;
  hobbies: string[];
}
```

Y en el fichero astro importamos la interfaz y tipamos las variables.

_./src/pages/about.astro_

```diff
---
+ import type { Identity } from './about.model.ts';

 const pageTitle = "Acerca de dinámico";

-  const identity = {
+ const identity: Identity = {
    firstName: "Sarah",
    country: "Canada",
    occupation: "Technical Writer",
    hobbies: ["photography", "birdwatching", "baseball"],
  };

-  const skills = ["HTML", "CSS", "JavaScript", "React", "Astro", "Writing Docs"];
+ const skills: string[] = ["HTML", "CSS", "JavaScript", "React", "Astro", "Writing Docs"];
---
```

Si te fijas prettier no está formateando el código, tenemos que hacer una serie de pasos:

- Instalar el plugin de prettier para astro

```bash
npm install --save-dev prettier-plugin-astro
```

- Crear un fichero `.prettierrc` en la raíz del proyecto con el siguiente contenido:

\__.prettierrc_

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

Añadir un prettier config:

_./.prettier.config.js_

```js
module.exports = {
  plugins: [require("prettier-plugin-astro")],
};
```
