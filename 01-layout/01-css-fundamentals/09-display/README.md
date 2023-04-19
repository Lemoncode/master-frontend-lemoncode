# Display

Vamos a jugar con la propiedad display.

Partimos del siguiente _html_:

```html
<body>
  <p>Hello, this <b>text</b> is important</p>
  <p>Hello, this <b>text</b> is important</p>
</body>
```

Añadimos un borde y aplicamos le aplicamos al ancho el 50% 

```css
p {
  border: 1px solid black;
  display: block;
  width: 50%;
}
```

Bien, ahora vamos a aplicar un estilo al texto en negrita:

```diff
p {
  border: 1px solid black;
  display: block;
  width: 50%;
}

+ b {
+   width: 150px;
+ }
```

Este nuevo estilo no afeta a los elementos. Por qué? porque por defecto el elemento _b_ se muestra como _inline_, si queremos que tome el tamaño que le hemos especificado tenemos que cambiarlo a _inline-block_

```diff
b {
+ display: inline-block;
  width: 150px;
}
```

Si cambiamos la propiedad _inline_ en el parrafo, se mostrarán ambos parrafos en la misma linea:

```diff
p {
border: 1px solid black;
- display: block;
+ display: inline;
width: 50%;
}
```
