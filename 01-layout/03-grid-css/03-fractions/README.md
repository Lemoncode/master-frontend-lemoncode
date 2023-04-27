# Fractions

Otra interesante opcion es usar fr, en este caso estamos trabajando con un a fracción, vamos a verlo con un ejemplo:

Borramos el html y el css.

```diff
<body>
+ <div class="grid-container">
+   <div class="item">1</div>
+   <div class="item">2</div>
+   <div class="item">3</div>
+   <div class="item">4</div>
+   <div class="item">5</div>
+   <div class="item">6</div>
+ </div>
</body>
```

Y vamos a contruir un grid añandiendo algunos estilos a cada grid item:

```css
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
  grid-template-columns: 100px 100px 100px;
}
.item {
  border: 1px solid black;
  background-color: khaki;
  display: flex;
  justify-content: center;
}
```

Si añadimos una fraccion a una columna, estamos indicando que esa columan toma todo el espacio disponible:

```diff
.grid-container {
display: grid;
border: 1px solid black;
grid-template-rows: 100px 100px;
- grid-template-columns: 100px 100px 100px;
+ grid-template-columns: 100px 1fr 100px;
}
```

Pero si aplicamos el mismo valor a la tercera columna entonces ambas tomaran todo el espacio disponible.

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 100px 1fr 100px;
+ grid-template-columns: 100px 1fr 1fr;
}
```

Tambien podemos usar fr para todas las columnas e indicarle que una de ellas cogerá el doble del espacio disponible:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 100px 1fr 1fr;
+ grid-template-columns: 1fr 2fr 1fr;
}
```

Haciendo esto la columna del medio tomará mas espacio que las otras.

## Diferencia entre % y fr

Partimos de esta definicion de columna para dejarlo mas simple

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 1fr 2fr 1fr  
+ grid-template-columns: 1fr 1fr;
}
```

Parece que si lo ponemos con % será igual el comportamiento:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
+ grid-template-columns: 50% 50%;  
- grid-template-columns: 1fr 1fr;
}
```

Pero que pasa en este caso y reducimos la pantalla? El contenido es mucho más grande que el propio grid.

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 50% 50%;  
+ grid-template-columns: 500px 50%;
}
```

La solución sería:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 500px 50%;  
+ grid-template-columns: 500px 1fr;
}
```

## Diferencia entre auto y fr

Partimos de este caso:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 500px 1fr;
+ grid-template-columns: 1fr 1fr 1fr;
}
```

Parece que el comportamiento es igual que para este otro:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: 500px 1fr;
+ grid-template-columns: auto auto auto;
}
```

Pero que pasa cuando le damos contenido diferentes a los div?:

```diff
  <body>
    <div class="grid-container">
-      <div class="item">1</div>
-      <div class="item">2</div>
-      <div class="item">3</div>
+      <div class="item">Esto</div>
+      <div class="item">Es una prueba de</div>
+      <div class="item">Como se comporta el auto</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
    </div>
  </body>
```

Los tamaños se reparten en función del contenido del hijo. Vamos a ver que pasa con:

```diff
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
- grid-template-columns: auto auto auto;
+ grid-template-columns: 1fr 1fr 1fr;
}
```

Dejamos el html y css como estaban:

```html
  <body>
    <div class="grid-container">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
    </div>
  </body>
```

```css
.grid-container {
  display: grid;
  border: 1px solid black;
  grid-template-rows: 100px 100px;
  grid-template-columns: 1fr 2fr 1fr;
}
.item {
  border: 1px solid black;
  background-color: khaki;
  display: flex;
  justify-content: center;
  width: 100%;
}
```