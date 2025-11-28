# Colecciones

¿Qué pasa si queremos mostrar una colección de elementos?

Pues es muy parecido a como lo hacemos con React: Podemos usar la función `map` de JavaScript para transformar la lista de urls de imágenes en una lista de elementos `img`.

Vamos a modificar la solicitud a la API para que devuelva varias fotos de perritos, en concreto pediremos 5.

```diff
---
const title = "Hello world !";
const imageError =
  "https://www.publicdomainpictures.net/pictures/190000/nahled/sad-dog-1468499671wYW.jpg";
- const res = await fetch("https://dog.ceo/api/breeds/image/random");
+ const res = await fetch("https://dog.ceo/api/breeds/image/random/5");
  const response = await res.json();
- const dogImageUrl = response?.message ?? imageError;
+ const dogImageUrls = response?.message ?? [imageError];
---
```

Y en el HTML vamos a reemplazar la imagen por un mapeo de las URLs a elementos img:

```diff
  <body>
    <h1>{title}</h1>
-    <img
-      src={dogImageUrl}
-      alt="Random Dog"
-      style="max-width: 400px; height: auto;"
-    />
+    <div>
+      {dogImageUrls.map((dogImageUrl : string) => (
+        <img
+          src={dogImageUrl}
+          alt="Random Dog"
+          style="max-width: 200px; height: auto; margin: 10px;"
+        />
+      ))}
+    </div>
    <div>
      <button id="cat-image-button">Get Cat Image</button>
    </div>
    <div>
      <img id="cat-image" style="max-width: 400px; height: auto;" />
    </div>
  </body>
```

Vamos a ver como ha quedado esto...

```bash
npm run dev
```

¡ Perfecto ! Ya lo tenemos listo.

En el siguiente video veremos como crear componentes.
