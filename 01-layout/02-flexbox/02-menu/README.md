# Menu

Es hora de hacer nuestro simple layout con flexbox :).

Vamos a añaidr el siguiente _html_

```html
<body>
  <div class="my-flex-container">
    <div class="menu"></div>
    <div class="content"></div>
  </div>
</body>
```

Y limpiar nuestro css (eliminamos el margin y el padding de nuestro elemento _body_)

```css
body {
  margin: 0px;
  padding: 0px;
}
```

Ahora viene la configuración del contenedor flexbox:

- Creamos una clase para el contenedor.
- Este contenedor tendrá la propiedad display _flex_.
- Indicaremos que los items se colocarán en fila
  (de izquierda a derecha)
- Y le diremos al contenedor que ocupe todo el ancho y alto del viewport.

```diff
body {
  margin: 0px;
  padding: 0px;
}

+ .my-flex-container {
+ display: flex;
+ flex-direction: row;
+ width: 100vw;
+ height: 100vh;
+ }
```

Vamos a añadirle algunos estilos al menu:

```diff
.my-flex-container: {
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}

+ .menu {
+ width: 150px;
+ background-color: cadetblue;
+ }
```

Ahora, definimos el area para el contenido, podríamos solo añadirle un color para diferenciarlo del menu:

```diff
.menu {
  width: 150px;
  background-color: cadetblue;
}

+ .content {
+ background-color: bisque;
+ }
```

El contenido no tiene ancho asignado por tanto no se muestra, pero queremos que el item coja todo el ancho disponible, ¿Como lo hacemos? Utilizamos la propiedad flex-grow.

```diff
.content {
 background-color: bisque;
+ flex-grow: 1;
}
```

Por defecto es 0, pero si le aplicamos 1 ocupará todo el contenido posible.

¿Que pasaría si ahora le añadimos un boder al menu?

```diff
.menu {
  width: 150px;
  background-color: cadetblue;
+ border: 15px solid black;
}
```

Nada se rompe, y no es necesario calculos adicionales.
