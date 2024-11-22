# Creando páginas

Vamos a crear páginas nuevas en Astro, y ver como funcionan, en este caso las páginas serán:

- About.
- Blog.

# A tener en cuenta:

- En el ejemplo del repo del máster hemos eliminado la accíon para desplegar automáticamente (si quieres habilitarlo en tu repo, puedes seguir los ejemplos anteriores).

- Recuerda tener instalada la extensión de VSC para Astro.

# Manos a la obra

Vamos a crear una página que se llamará `about.astro` en la carpeta `src/pages`:

_./src/pages/about.astro_

```astro
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Acerca de</title>
	</head>
	<body>
    <h1>Acerca de...</h1>
    <h2>Y mi nuevo blog</h2>

    <p>Esta es la página de "acerca de".</p>

    <p>Aquí iría to BIO</p>
    </body>
</html>
```

Si ahora arrancamos el proyecto y navegamos a `http://localhost:4321/about` veremos la página que acabamos de crear.

Vamos ahora a añadir navegación...

_./src/layouts/about.astro_

```diff
	<body>
+   <a href="/">Home</a>
+   <a href="/about/">About</a>

    <h1>Acerca de...</h1>
    <h2>Y mi nuevo blog</h2>
```

Vamos a añadir una página de blog:

_./src/pages/blog.astro_

```astro
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Acerca de</title>
	</head>
	<body>
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/about/">About</a>

    <h1>Blog</h1>
    <h2>Aqui va mi listado de posts</h2>
    </body>
</html>
```

Y modificamos los enlaces en el about también:

_./src/layouts/about.astro_

```diff
	<body>
   <a href="/">Home</a>
+  <a href="/blog">Blog</a>
   <a href="/about/">About</a>

    <h1>Acerca de...</h1>
    <h2>Y mi nuevo blog</h2>
```

Y ya que estamos en la págia principal:

_./src/layouts/index.astro_

```diff
  <body>
+   <a href="/">Home</a>
+   <a href="/blog">Blog</a>
+   <a href="/about/">About</a>
```

> Más adelante veremos como crear componentes reusables.

Si ejecutamos podemos ver que la navegación funciona correctamente.

Si hacemos commit y push podemos ver que se lanza la Github Actions y en unos minutos veremos la web actualizado en gh-pages.
