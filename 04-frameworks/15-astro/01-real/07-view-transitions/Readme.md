# 07 Transiciones de Vista

Cuando construimos un proyecto con Astro, nos salimos del paradigma SPA, es decir, tenemos multiples páginas HTML que se cargan de forma independiente.

Esto puede resultar en una experiencia de usuario menos fluida, ya que cada cambio de página implica una recarga completa del contenido, lo que vulgarmente se traduce en parpadeos y tiempos de espera, ¿No hay una forma de dar una sensación de navegación más fluida al usuario? La respuesta es Sí y es que los navegadores modernos soportan algo llamado **View Transitions API**, Astro nos ofrece un wrapper sobre esto, que además de hacerlo más sencillo de usar, nos asegura compatibilidad con navegadores que no soportan esta API de forma nativa.

¿Vemos como funciona?

## Paso 1: Agregar soporte para View Transitions

Para empezar a usar las transiciones de vista, tenemos que añadir el componente `ClientRouter` del paquete `astro:transitions` en la sección `<head>` que se comparte entre todas las páginas de la aplicación, vamos a hacerlo en el archivo de layout principal.

_./src/layouts/layout.astro_

```diff
---
+import { ClientRouter } from "astro:transitions";
// (...)
---
<head>
... other head elements ...
+<ClientRouter />
</head>
```

Con solo esto, ya podrás notar que al navegar entre páginas hay una pequeña transición, pero... vamos a mejorarla un poco.

## Paso 2: Implementar las View Transitions

Ahora que tenemos las transiciones configuradas, vamos a crear una.

Usamos la directiva `transition:name` para especificar el nombre de la transición en los elementos que deben animarse durante la navegación.
En este caso, utilizaremos el título de la publicación como nombre de transición.

Primero en el componente que muestra el detalle del post:

_./src/pods/post/components/body.astro_

```diff
<h1
class="text-tbase-500/90 text-5xl leading-[1.1] font-bold"
id="article-section-heading"
+transition:name={`${entry.title}-title`}
  >
```

y después en el componente que muestra la tarjeta del post en la lista de posts:

_./src/pods/post-collection/components/post-card.astro_

```diff
<h3
class="group-hover:text-primary-700 text-tbase-500/90 text-xl font-bold transition-colors duration-300"
+ transition:name={`${post.title}-title`}
>
```

Así cuando transicionemos de la lista de posts al detalle del post, el título se animará suavemente entre ambas vistas.

## Paso 3: Corregir el problema con el modo oscuro

Cuando usamos transiciones de vista, podemos encontrarnos con un problema relacionado con el **modo oscuro**, donde la transición no respeta el tema actual.
Para solucionarlo, necesitamos usar los eventos de Astro.

Elimina el script anterior del cambio de tema (si lo tienes) y reemplázalo por el siguiente código en tu componente de encabezado:

_src/components/header.astro_

```diff
- <script>
-  const button = document.getElementById('theme-toggle');
-  const html = document.documentElement;
-  const storedTheme = localStorage.getItem('theme');
-
-  if (storedTheme) {
-    html.classList.toggle('dark', storedTheme === 'dark');
-  }
-  if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
-    html.classList.add('dark');
-  }
-
-  button?.addEventListener('click', () => {
-    html.classList.toggle('dark');
-    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
-  });
- </script>
+ <script>
+  const handleThemeToggle = () => {
+    const html = document.documentElement;
+    html.classList.toggle("dark");
+    localStorage.setItem(
+      "theme",
+      html.classList.contains("dark") ? "dark" : "light"
+    );
+  };
+
+  const initThemeToggle = () => {
+    const button = document.getElementById("theme-toggle");
+    const html = document.documentElement;
+    const storedTheme = localStorage.getItem("theme");
+
+    if (storedTheme) {
+      html.classList.toggle("dark", storedTheme === "dark");
+    }
+    if (
+      !storedTheme &&
+      window.matchMedia("(prefers-color-scheme: dark)").matches
+    ) {
+      html.classList.add("dark");
+    }
+
+    // Limpiar el listener anterior si existe
+    button?.removeEventListener("click", handleThemeToggle);
+
+    // Agregar nuevo listener
+    button?.addEventListener("click", handleThemeToggle);
+  };
+
+  // Inicializar al cargar
+  initThemeToggle();
+
+  // Re inicializar después de cada transición de vista
+  document.addEventListener("astro:after-swap", initThemeToggle);
+ </script>
```

Podemos hacer muchas más cosas con las **view transitions**, pero por ahora esto es suficiente para comenzar.
Puedes explorar más sobre este tema en la [documentación oficial de Astro](https://docs.astro.build/en/guides/view-transitions/).
