# Estilado con Scope

Vamos a cubrir un tema interesante, y es el estilado.

En Astro podemos tener dos tipos de estilos:

- Globales: aplican a toda la aplicación.
- Locales: tiene un scope y sólo aplican a la página donde se usen.

Arrancamos con los locales.

# Manos a la obra

Una forma muy aceptada de usar estilos en Astro es metiendolos dentro del propio fichero.

Vamos a empezar por estilar los _h1_

_./src/pages/about.astro_

```diff
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
+    <style>
+      h1 {
+        color: purple;
+        font-size: 4rem;
+      }
+    </style>
  </head>
```

Como puedes ver el _h1_ estilado se muestra sólo en la página de _about_.

Vamos a añadir una clase:

```diff
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{pageTitle}</title>
    <style>
      h1 {
        color: purple;
        font-size: 4rem;
      }
+     .skill {
+       color: green;
+       font-weight: bold;
+     }
    </style>
  </head>
```

y

```diff
    <ul>
-      {skills.map((skill) => <li>{skill}</li>)}
+      {skills.map((skill) => <li class="skill">{skill}</li>)}
    </ul>
```

Vamos a probarlo

```bash
npm run dev
```

También podemos sacar los estilos fuera, le metemos el prefijo _.modules_ para que tenga scope
Si lo ponemos sin modules:

_./src/pages/about.module.css_

```css
.skillb {
  color: red;
  font-weight: bold;
}
```

_./src/pages/about.astro_

```diff
---
import type { Identity } from "./about.model.ts";
+ import styles from "./about.module.css";

const pageTitle = "Acerca de dinámico";
```

```diff
    <ul>
-      {skills.map((skill) => <li class="skill">{skill}</li>)}
+      {skills.map((skill) => <li class={styles.skillb}>{skill}</li>)}
    </ul>
```

Si te fijas da error, tenemos que decirle a typescript como manejar estos imports, me creo en el raíz del src un fichero _./src/css.d.ts_ con el siguiente contenido:

```typescript
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
```

Y miramos en el inspector.

Si te fijas el estilo sale con el scope.

Vamos a volver a la solución anterior, eliminamos el import y cambiamos el nombre de la clase de _skillb_ a _skill_.

_./src/pages/about.astro_

```diff
---
import type { Identity } from "./about.model.ts";
- import styles from "./about.module.css";
```

```diff
    <p>Mis skills</p>
    <ul>
-      {skills.map((skill) => <li class={styles.skillb}>{skill}</li>)}
+     {skills.map((skill) => <li class="skill">{skill}</li>)}
    </ul>
```

¿Por qué volvemos? Porque en el `style` de astro nos trae azúcar para definir variables CSS.

Vamos a defininir una variable con el color de los skills.

_./src/pages/about.astro_

```diff
const skills = ["HTML", "CSS", "JavaScript", "React", "Astro"];
const happy = true;
const finished = false;
const goal = 3;

+ const skillColor = "navy";
---
```

Y ahora fijate que chulo, en el tag style, puedo mapear esa variable de TypeScript a una variable CSS

_./src/pages/about.astro_

```diff
-    <style>
+    <style define:vars={{skillColor}}>
      h1 {
        color: purple;
        font-size: 4rem;
      }
      .skill {
-        color: green;
+ color: var(--skillColor);
        font-weight: bold;
      }
    </style>
```
