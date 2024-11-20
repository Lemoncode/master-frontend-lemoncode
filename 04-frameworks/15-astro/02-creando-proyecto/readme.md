# Hola Astro

Vamos a arrancar por crear el proyecto.

Nos vamos a basar en el tutorial oficial de Astro, pero:

- Lo implementaremos usando TypeScript como lenguaje.
- Desplegaremos en una página de Github IO.

## Creando el proyecto

Vamos a crear un proyecto desde cero, para ello usamos la tool de `Astro`:

```bash
npm create astro@latest
```

En la primera pregunta, `Where would you lik to create your new project?`, le decimos damos como nombre de carpeta `ejemplo`.

`Where would you lik to create your new project?`
ejemplo

En cuanto a plantillas, vamos a decirle que partimos de un proyecto desde cero: `Empty Template`.

Vamos a indicarle ahora que SI queremos usar TypeScript

`Would you like to use TypeScript?`
y

Le vamos a decir que quremos usar TypeScript en modo estricto.

`How would you like to start your new project`
Strict

También le indicamos que instale todas las dependencias necesarias.

`Would you like to install dependencies?`
y

Y en este punto nos pregunta si queremos generar repo de git en local, en nuestro caso le decimos que si, pero aquí depende mucho de como tengas tu proyecto organizado.

`Would you like to initialize a git repository?`
y

Vamos ahora a abrir el proyecto desde VSCode y lanzarlo desde el terminal:

```bash
npm run dev
```

Abrimos el navegador y vamos a `http://localhost:4321`

Vamos ahora a hacer una modificación pequeña para ver que todo funciona correctamente.

Vamos a cambiar el texto del `index.astro`:

_./src/pages/index.astro_

```diff
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
-		<title>Astro</title>
+   <title>Mi Blog de Ejemplo</title>
	</head>
	<body>
-		<h1>Astro</h1>
+   <h1>Mi Blog de Ejemplo</h1>
	</body>
</html>
```
