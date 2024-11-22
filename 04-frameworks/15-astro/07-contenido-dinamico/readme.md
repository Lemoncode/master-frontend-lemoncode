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
+    firstName: "Paquillo",
+    country: "Argentina",
+    occupation: "Programador",
+    hobbies: ["fotografía", "beber cerveza", "futbol"],
+  };
+
+  const skills = ["HTML", "CSS", "JavaScript", "React", "Astro"];
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

> Estos valores los podríamos haber leido de una API Rest por ejemplo.

Y ahora lo vamos a usar:

_./src/pages/about.astro_

```diff
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <a href="/">Home</a>
    <a href="/blog">Blog</a>
    <a href="/about/">About</a>

    <h1>{pageTitle}</h1>
    <h2>Y mi nuevo blog</h2>

    <p>Esta es la página de "acerca de".</p>

-    <p>Aquí iría to BIO</p>
<p>Here are a few facts about me:</p>
+  <ul>
+    <li>Me llamo {identity.firstName}.</li>
+    <li>vivo en {identity.country} y trabajo com {identity.occupation}.</li>
+    {identity.hobbies.length >= 2 &&
+      <li>Dos de mis hobbies son: {identity.hobbies[0]} and {identity.hobbies[1]}</li>
+    }
+  </ul>
+  <p>Mis skills:</p>
+  <ul>
+    {skills.map((skill) => <li>{skill}</li>)}
+  </ul>
  </body>
</html>
```

También esto soporte rendering condicional como en React:

_./src/pages/about.astro_

```diff
---
import type { Identity } from "./about.model.ts";

const pageTitle = "Acerca de dinámico";

const identity = {
  firstName: "Paquillo",
  country: "Argentina",
  occupation: "Programador",
  hobbies: ["fotografía", "beber cerveza", "futbol"],
};

const skills = ["HTML", "CSS", "JavaScript", "React", "Astro"];

+ const happy = true;
+ const finished = false;
+ const goal = 3;
---
```

```diff
<p>Mis skills</p>
<ul>
  {skills.map((skill) => <li>{skill}</li>)}
</ul>
+ {happy && <p>Estoy mu contento !</p>}

+ {finished && <p>He completado este tutorial</p>}

+ {goal === 3 ? <p>Mi meta es completarlo en 3 días.</p> : <p>Pues no llevo tres días.</p>}
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
