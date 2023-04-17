# Attribute selectors

Vamos a trabajar sobre los selectores por atributos

Vamos a crear unos enlaces:

```diff
<body>
- <div id="app">
- <h1 class="title">Bienvenido al módulo de layout</h1>
- <h2>by Lemoncode</h2>
- <div class="title">Esto es el título</div>
- <div id="marca">Hola desde #marca</div>
- </div>
+ <a title="Website" href="http://www.lemoncode.net">lemoncode</a>
+ <a title="Email" href="mailto:info@lemoncode.net">EMail</a>
+ <a href="file1.pdf">File PDF</a>
+ <a href="file2.txt">File TXT</a>
</body>
```

Eliminamos todo el contenido de la hora de estilo

```diff
- body {
-  background-color: brown;
-}
-h1,
-h2 {
-  color: white;
-}
-.title {
-  color: blue;
-  font-size: 500%;
-}
-
-#myid {
-  margin: 25px;
-}
```

Vamos a añadir un estilo usando el selector por atributos, podemos indicar que todos los elementos que contenga un atributo _href_ tenga un tamaño de letra y padding determinado.

```css
[href] {
  font-size: 125%;
  padding: 8px;
}
```

Genial! hemos conseguido que nuestros enlaces se vean mas grandes y tenemos el mismo espacio entre ellos.

Ahora, queremos darle un color especial a los enlaces que contienen la substring _lemoncode_ :

```diff
[href] {
 font-size: 125%;
 padding: 8px;
}

+ [href*="lemoncode"] {
+ background-color: green;
+ color: white;
+ }
```

Perfecto, tenemos todos los enlaces que contiene lemoncode substring en el _href_ con un color de letra y fondo determinado.

Ahora, vamos a aplicar un estilo especial a todos los _hrefs_ que terminen en _pdf_:

```diff
[href] {
  font-size: 125%;
  padding: 8px;
}
[href*="lemoncode"] {
  background-color: green,
  color: white,
}
+ [href$=".pdf"] {
+   background-color: indianred;
+   color: white;
+ }
```

> Practica para un alumno... queremos poner el color de fondo a _darkblue_
> y el de letra a _white_ para todos los hrefs que tenga la extension _txt_

_Solucion_

```diff
[href$=".pdf"] {
background-color: indianred;
color: white;
}

+ [href$=".txt"] {
+ background-color: darkblue;
+ color: white;
+ }
```

Tambien podemos concatenar los selectores, por ejemplo podemos aplicar un estilo extra a _href_ que contengan Lemoncode y que su titulo sea website:

```css
[title="Website"][href*="lemoncode"] {
  font-size: 200%;
}
```

Tambien podemos ver un ejemplo sobre un atributo con una lista de elementos

```diff
+    <div value="top-header top">
+        <p>TEST</p>
+   </div>
```

Ahora vamos a darle estilos a los elementos que tengan un atributo value con una lista con valores top o top-[cualquier valor] 

```css
  [value|='top'] {
    background: yellow;
  }
```

Pero no funcionará si modificamos el valor como se ve en el ejemplo. 

```diff
+    <div value="topheader">
+        <p>TEST</p>
+   </div>
```