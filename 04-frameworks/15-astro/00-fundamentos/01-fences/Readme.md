# 🪐 Fences

Partimos de la demo anterior **00-creando-proyecto**. Simplemente copia ese proyecto en una carpeta limpia y ejecuta `npm install` y después `npm run dev`.

Toca adentrarse en los componentes de Astro. Si te fijas, se parecen un poco a los de Vue: donde sueles tener HTML y estilos, todo en el mismo archivo.

Vamos a probar algo: cambiamos el _h1_ de la página principal por un texto definido en una variable.

_./src/pages/index.astro_

```diff
---
+ const title = "Hello world !!";
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>

	</head>
	<body>
-		<h1>Astro</h1>
+    <h1>{title}</h1>
```

> El binding funciona exactamente igual que en React: usamos llaves `{}` para indicar una variable.

Si lo ejecutamos, veremos el nuevo título.

```bash
npm run dev
```

Y ahora quizás te preguntes: ¿qué son los _Fences_?

Son bloques de código que se ejecutan en el servidor. Si estamos en modo **SSG** (Static Site Generation), solo se ejecutan una vez: cuando se genera el sitio, es decir en tiempo de build.

Para verlo más claro: vamos a obtener un valor aleatorio desde una API y mostrarlo en la página.

Por ejemplo, existe una API pública que devuelve fotitos de perros

_./src/pages/index.astro_

```diff
---
const title = "Hello world !!";
+ const imageError = "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
+ const res = await fetch("https://dog.ceo/api/breeds/image/random");
+ const response = await res.json();
+ const dogImageUrl = response?.message ?? imageError;
---
```

Y actualizamos el HTML para mostrar una imagen:

_./src/pages/index.astro_

```diff
	<body>
     <h1>{title}</h1>
+    <img src={dogImageUrl} alt="Random Dog" style="max-width: 400px; height: auto;"/>
```

Toca comprobar el resultado en el navegador, deberíamos ver una foto de un lindo perrito.

Si hacemos un build y miramos el archivo generados en _./dist/index.html_, veremos que la imagen del perro ya está incluida, porque se obtuvo en el momento de la construcción del sitio, el código que había entre rejas ya no existe.

```bash
npm run build
```

> Si estamos en modo **SSR**, este código se ejecutará en cada petición al servidor. Nunca se ejecuta en el navegador.

Y ahora te puede venir la siguiente duda... hemos ejecutado código en servidor, pero... ¿Podemos ejecutar código en el navegador? ¡Por supuesto! Incluso podemos usar React, Vue o Svelte.

Hagamos un ejemplo muy simple en vanilla JavaScript: añadiremos un botón que obtenga y muestre un dato curioso sobre gatos. El botón se llamará **“Get Cat Image”**.

_./src/pages/index.astro_

```diff
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>{title}</h1>
		<img src={dogImageUrl} alt="Random Dog" />
+  <div>
+		  <button id="cat-image-button">Get Cat Image</button>
+  </div>
+  <div>
+		  <img id="cat-image" style="max-width: 400px; height: auto;"/>
+   </div>
	</body>
</html>

+ <script>
+ const button = document.getElementById("cat-image-button");
+ const imageEl = document.getElementById("cat-image") as HTMLImageElement;
+
+ if (button && imageEl) {
+  button.addEventListener("click", async () => {
+    const res = await fetch("https://api.thecatapi.com/v1/images/search");
+    const data = await res.json();
+    imageEl.src = data[0].url;
+  });
+}
+ </script>
```

Si lo ejecutamos, veremos que al hacer click en el botón aparece una foto nueva de un lindo gatito.

```bash
npm run dev
```

Ahora quizás te preguntes: Código en servidor y código en cliente ¿Cómo depuro esto? Veamos como:

Para depurar **código dentro de un fence**:

- Coloca un punto de ruptura (breakpoint) dentro del bloque de código.
- Abre una terminal en modo **JavaScript Debug Terminal** y ejecuta:

```bash
npm run dev
```

Cuando ejecutes el servidor, se detendrá en el punto de ruptura y podrás depurar.

Importante: en modo desarrollo local, cada vez que recargues la página, el código del fence se ejecutará de nuevo. Pero esto solo ocurre en modo dev — en producción, si estás en modo SSG, se ejecuta una sola vez, al construir el sitio.

¿Y cómo depuramos el **código del navegador**? Como siempre: con las DevTools del navegador.

**Bonus** También puedes extraer este código a un archivo _ts_, vamos a ajustar un poco el código para que sea más limpio:

_./src/pages/cat.ts_

```ts
async function getCatImage() {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await res.json();
  return data[0].url;
}

export const setupCatFactButton = () => {
  const button = document.getElementById("cat-image-button");
  const imageEl = document.getElementById("cat-image") as HTMLImageElement;

  if (button && imageEl) {
    button.addEventListener("click", async () => {
      const fact = await getCatImage();
      imageEl.src = fact;
    });
  }
};
```

_./src/pages/index.astro_

```diff
// (...)

<script>
+ import { setupCatFactButton } from "./cat";
+ setupCatFactButton();
- const button = document.getElementById("cat-image-button");
- const imageEl = document.getElementById("cat-image") as HTMLImageElement;
-
- if (button && imageEl) {
-  button.addEventListener("click", async () => {
-    const res = await fetch("https://api.thecatapi.com/v1/images/search");
-    const data = await res.json();
-    imageEl.src = data[0].url;
-  });
-}
</script>

```

En el siguiente vídeo veremos como trabajar con listas de elementos.
