Vamos a partir del examplo anterior.

Identificamos al div siguente a _element_ como _element2_:

```diff
<body>
<p>Posicionamiento</p>
<div class="box"></div>
<div class="box" id="element"></div>
- <div class="box"></div>
+ <div class="box" id="element2"></div>
<p>
```

Cambiamos el posicionamiento de _#element_ a _relative_:

```diff
#element {
- position: sticky;
+ position: relative;
top: 0px;
left:50px;
background-color: darkorange;
border:
```

Y le añadimos un estilo similar al _element2_

```diff
+ #element2 {
+   border: 3px solid brown;
+   position: relative;
+   top: 0px;
+   left: 20px;
+   background-color: lightblue;
+ }
```

Ahora ambos divs se solapan, pero como consigo que el div naranja se muestre por encima del azul? Podemos cambiar esto con la propiedad _z-indez_:

```diff
#element {
  position: relative;
  top: 0px;
  left: 50px;
  background-color: darkorange;
  border: 3px solid brown;
+ z-index: 2;
}

#element2 {
  border: 3px solid brown;
  position: relative;
  top: 0px;
  left: 20px;
  background-color: lightblue;
+ z-index: 1;
}
```

Si queremos mostrar un dialogo modal, vamos a darle un valor a la propiedad z-index muy alto.
