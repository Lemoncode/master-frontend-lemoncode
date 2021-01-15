# CONCEPTOS FLEXBOX

Vamos a partir del siguiente HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="contenedor">
      <h1>Conceptos Flexbox</h1>

      <div class="contenedor-flex">
        <div class="elemento-flex elemento-1">
          <h2>Elemento 1</h2>
        </div>
        <div class="elemento-flex elemento-2">
          <h2>Elemento 2</h2>
        </div>
        <div class="elemento-flex elemento-3">
          <h2>Elemento 3</h2>
        </div>
      </div>
    </div>
  </body>
</html>
```

Además comenzaremos con la siguiente hoja de estilos:

```css
body {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1,
h2 {
  text-align: center;
  font-family: Roboto, Helvetica, serif;
}
h2 {
  color: white;
}

.contenedor {
  background-color: white;
  height: calc(100vh - 20px);
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 30px 0 30px;
}

.contenedor-flex {
  border: 3px solid black;
}

.elemento-flex {
  padding: 10px;
  background-color: #9e3332;
}

.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
}

.elemento-flex:nth-child(3) {
  background-color: #b5b33f;
}
```

## Implementando Flexbox

Para definir un layout con Flexbox es necesario tener un contenedor padre con la propiedad `display` con valor `flex` o `inline-flex`.

1. Por tanto, vamos a comenzar definiendo el contenedor con la propiedad `display` correspondiente:

```diff
.contenedor-flex {
  border: 3px solid black;
+  display: flex;
}
```

### Display

Podemos definir el contenedor flex como `flex` o `inline-flex`. La diferencia entre uno y otro es que con `flex` el contenedor ocupará el ancho disponible y con `inline-flex` sólo el necesario para albergar a los elementos hijos.

```diff
.contenedor-flex {
  border: 3px solid black;
-  display: flex;
+  display: inline-flex;
}
```

### Flex Direction

Tenemos otra propiedad llamada `flex-direction` que sirve para indicar en qué dirección queremos establecer el eje principal.

Si queremos posicionar los elementos hijos en fila, es decir, eje principal en horizontal y de izquierda a derecha debemos establecer esta propiedad con el valor `row`. De hecho es el valor por defecto de esta propiedad.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
+  flex-direction: row;
}
```

La siguiente propiedad es `row-reverse`. También establece el eje principal en fila, pero posicionará los elementos hijos de derecha a izquierda.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
-  flex-direction: row;
+  flex-direction: row-reverse;
}
```

Si queremos establecer la dirección en el eje vertical, sólo debemos hacer uso del valor `column`.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
-  flex-direction: row-reverse;
+  flex-direction: column;
}
```

Y al igual que con `row-reverse`, si aplicamos `column-reverse` comenzará a posicionar los elementos hijos por el final.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
-  flex-direction: column;
+  flex-direction: column-reverse;
}
```

Fíjate que hemos establecido la propiedad `display` como `inline-flex`. ¿Qué crees que ocurrirá si la cambiamos a `flex`?

```diff
.contenedor-flex {
  border: 3px solid black;
-  display: inline-flex;
+  display: flex;
  flex-direction: column-reverse;
}
```

Como dijimos al principio, el valor `flex` establece que el contenedor flex ocupará el ancho máximo, se comportará como un `display: block`. Por tanto, al estar en columnas, los hijos crecen para ocupar el ancho disponible.

### Flex Wrap

Tenemos otra propiedad llamada `flex-wrap` que en resumen sirve para indicar si queremos que el contenedor flexbox disponga los elementos hijos en una sola línea o puedan influir en varias líneas.

Si queremos que los elementos hijos crezcan en la dirección del eje principal y permitir que desborden el contenedor flexbox, estableceremos el valor en `nowrap`. De hecho, este es el valor por defecto de la propiedad.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: flex;
-  flex-direction: column-reverse;
+  flex-direction: row;
+  flex-wrap: nowrap;
}
```

La siguiente propiedad es `wrap`. Esta propiedad no permite que los hijos desborden el contenedor padre y por tanto los obliga a posicionarse en multilínea.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
  flex-direction: row;
-  flex-wrap: nowrap;
+  flex-wrap: wrap;
}
```

Y por último, si queremos establecer la dirección en el eje principal pero en sentido inverso, sólo debemos hacer uso del valor `wrap-reverse`.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: inline-flex;
  flex-direction: row;
-  flex-wrap: wrap;
+  flex-wrap: wrap-reverse;
}
```

### Flex Flow

También podemos hacer uso de la propiedad `flex-flow` que admite como primer valor `flex-direction` y como segundo valor `flex-wrap`, por tanto es un atajo para establecer estas propiedades.

```diff
.contenedor-flex {
  border: 3px solid black;
  display: flex;
-  flex-direction: row;
-  flex-wrap: wrap-reverse:
+  flex-direction: row wrap;
}
```