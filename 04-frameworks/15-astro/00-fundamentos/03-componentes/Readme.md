# Componentes

Hasta ahora hemos estado programando todo en un solo archivo astro, pero a medida que nuestras páginas crecen es normal que queramos dividirla en piezas más pequeñas.

Vamos a crear un componente simple para mostrar las fotos de perritos.

Para ello crearemos una nueva carpeta debajo de `src`, la llamaremos `components`. Y dentro añadimos un archivo que llamaremos `DogPics.astro`

- Este recibirá la lista de urls como una propiedad tipada.
- Recorrerá la lista de urls y los mostrará como una lista de elementos `<img>`.

Es decir, vamos a encapsular la lógica de mostrar las imágenes de perros en un componente reutilizable.

_./src/components/DogPics.astro_

```astro
---
interface Props {
  urls: string[];
}
const { urls } = Astro.props;
---

<div>
  {urls.map((url) => <img src={url} alt="Random Dog" style="max-width:200px;height:auto;" />)}
</div>
```

Vamos ahora a usar este componente en nuestra página principal.

En `src/pages/index.astro`, importa el componente y úsalo:

```diff
---
+ import DogPics from '../components/DogPics.astro';
const title = "Hola world !!";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
const response = await res.json();
const dogImageUrls = response?.message ?? [imageError];
---
```

```diff
  <body>
    <h1>{title}</h1>
-    <div>
-      {
-        dogImageUrls.map((url: string) => (
-          <img
-            src={url}
-            alt="Random Dog"
-            style="max-width:200px;height:auto;"
-          />
-        ))
-      }
-    </div>
+    <DogPics urls={dogImageUrls} />
    <div>
			<button id="cat-image-button">Get Cat Image</button>
		</div>
		<div>
			<img id="cat-image" style="max-width: 400px; height: auto;"/>
		</div>
  </body>
```

Ahora estarás pensando, ¡ Anda tenemos props como en React !, pero... ¿Qué diferencia hay? La clave es que esto solo se ejecuta una vez, y una vez que estamos en el lado del cliente, no hay forma de interactuar con las props. Por ejemplo, no podemos usar una propiedad de tipo callback, sí, la típica que usaríamos para burbujear al padre el evento click de un botón.

¿Y qué pasa si necesitamos un componente que esté vivo? Ahí es donde entran en juego las **Client Islands**. Podemos crear una Client Island con React, Svelte, Vue u otro framework compatible, y decidir si se ejecuta solo en el servidor o si habilita la ejecución del lado del cliente. Este concepto lo veremos más adelante.

En el siguiente video nos metemos de lleno a trabajar con CSS.
