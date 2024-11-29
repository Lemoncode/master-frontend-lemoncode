# Estilado global

Ya hemos visto el estilo local en las páginas, pero hay veces que necesitamos definir estilos globales sin escapar, vamos a ver como hacerlo.

# Manos a la obra

En esta ruta `src/styles/global.css` definimos los estilos globales, por ejemplo:

_./src/styles/global.css_

```css
html {
  background-color: #f1f5f9;
  font-family: sans-serif;
}

body {
  margin: 0 auto;
  width: 100%;
  max-width: 80ch;
  padding: 1rem;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

h1 {
  margin: 1rem 0;
  font-size: 2.5rem;
}
```

Y vamos a importarlo en el _about_

_./src/pages/about.astro_

```diff
---
+ import '../styles/global.css';
import type { Identity } from "./about.model.ts";

const pageTitle = "Acerca de dinámico";
```

Si ahora ejecutamos podemos ver que se han aplicado los estilos a esta página.

Podemos añadirlo al resto de páginas