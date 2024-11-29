# Ejecutando código en el navegador

Hasta ahora todo el código que hemos escrito se ha ejecutado en nuestra máquina local en tiempo de generación de las páginas HTML finales.

Pero ¿Qué pasa si necesito ejecutar JavaScript en el navegador? Es muy normal quere meter interactividad más avanzada y no sólo HTML.

Vamos a ello.

# Manos a la obra

El menú de cabecera sólo funciona bien si estamos en escritorio, si nos vamos a resolucón de móvil, nos haría falta ocultar el menú horizontal y mostrar un menú hamburguesa, para eso nos hace falta JavaScript.

Creamos un component Hamburguer (la opción del menú con tres lineas)

_./src/components/hamburger.astro_

```astro
---
---
<div class="hamburger">
  <span class="line"></span>
  <span class="line"></span>
  <span class="line"></span>
</div>
```

Vamos crear un componente de cabecera

_./src/components/header.astro_

```astro
---
import Hamburger from './hamburger.astro';
import Navigation from './navigation.astro';
---
<header>
  <nav>
    <Hamburger />
    <Navigation />
  </nav>
</header>
```

Y vamos a definir unos estilos globales para el menú hamburguesa (ojo a los del final de la media query)

\_./src/styles/global.css

```diff
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

/* nav styles */
+ .hamburger {
+  padding-right: 20px;
+  cursor: pointer;
+ }
+
+ .hamburger .line {
+  display: block;
+  width: 40px;
+  height: 5px;
+  margin-bottom: 10px;
+  background-color: #ff9776;
+ }

.nav-links {
  width: 100%;
  top: 5rem;
  left: 48px;
  background-color: #ff9776;
  display: none;
  margin: 0;
}

.nav-links a {
  display: block;
  text-align: center;
  padding: 10px 0;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
}

.nav-links a:hover,
.nav-links a:focus {
  background-color: #ff9776;
}

.expanded {
  display: unset;
}

@media screen and (min-width: 636px) {
  .nav-links {
    margin-left: 5em;
    display: block;
    position: static;
    width: auto;
    background: none;
  }

  .nav-links a {
    display: inline-block;
    padding: 15px 20px;
  }
  /* OJO ESTO DENTRO DE LA MEDIA QUERY*/
+  .hamburger {
+    display: none;
+  }
}
```

Y vamos a darle uso en el index.astro

_./src/pages/index.astro_

```diff
---
import "../styles/global.css";
- import Navigation from "../components/navigation.astro";
+ import Header from "../components/header.astro";
import Footer from "../components/footer.astro";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Mi Blog de Ejemplo</title>
  </head>
  <body>
-    <Navigation />
+    <Header/>
```

Si probamos, podemos ver que se muestra el menú hamburguesa, si nos vamos a resolución de móvil, pero ahora nos hace falta interactuar con él (qué pinches y pase algo).

Para ello podemos directamente meter un tag de _script_ en javascript y hacer algo así como:

_./src/pages/index.astro_

```diff
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Mi Blog de Ejemplo</title>
  </head>
  <body>
    <Header />

    <h1>Mi blog de Ejemplo 3</h1>
    <Footer />
+    <script>
+      document.querySelector(".hamburger")?.addEventListener("click", () => {
+        document.querySelector(".nav-links")?.classList.toggle("expanded");
+      });
+    </script>
  </body>
</html>
```

Esto no está mal, pero primero estamos metiendo JS dentro de la página, algo un poco feo y por otro lado no podemos usar _TypeScript_ vamos a sacar esto a un fichero externo.

Primero eliminamos lo que habíamos incluido:

_./src/pages/index.astro_

```diff
    <Footer />
-    <script>
-      document.querySelector(".hamburger")?.addEventListener("click", () => {
-        document.querySelector(".nav-links")?.classList.toggle("expanded");
-      });
-    </script>
  </body>
```

Y vamos a crear una carpeta que se llamará _scripts_ y dentro un fichero _hamburger.ts_

_./src/scripts/hamburger.ts_

```typescript
document.querySelector(".hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("expanded");
});
```

Y lo importamos en el index.astro

_./src/pages/index.astro_

```diff
    <Footer />
+  <script>
+   import "../scripts/hamburger.ts";
+  </script>
```
