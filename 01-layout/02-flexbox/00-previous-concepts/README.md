# Previous concepts

## Overload

Vamos a ver un simple ejemplo para entender como funciona overload.

Creamos el siguiente _html_

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="./style.css" />
</head>
<body>
   <div class="small-container">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
   </div>
  </body>
</html>
```

Y el css

```css
.small-container {
    width: 200px;
    height: 200px;
    border: 1px solid black;
}
```

Ahora vemos como el texto es mayor que el contenedor podemos jugar de varias formas.

Primero ocultamos lo que sobresale del texto:

```diff
.small-container {
    width: 200px;
    height: 200px;
    border: 1px solid black;
+   overflow: hidden;
}
```

Segundo mostramos scroll para que se pueda desplazar y ver todo el contenido:

```diff
.small-container {
    width: 200px;
    height: 200px;
    border: 1px solid black;
-   overflow: hidden;
+   overflow: scroll;
}
```

Podemos hacer que aparezca el scroll solo si es necesario

```diff
.small-container {
    width: 200px;
    height: 200px;
    border: 1px solid black;
-   overflow: scroll;
+   overflow: auto;
}
```

## Float

Limpiamos el _html_ y partimos de este:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="./style.css" type="text/css" rel="stylesheet" />
  </head>
  <body>
    <div class="container">
      <img
        src="https://cdn.pixabay.com/photo/2020/04/13/13/27/animal-5038385_960_720.jpg"
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu
      fringilla neque, nec maximus magna. Integer facilisis ex massa, vel
      iaculis erat finibus in. Nunc sapien justo, fringilla luctus risus
      rhoncus, mollis aliquam est. Quisque cursus massa non arcu pulvinar
      ultricies. Morbi eget quam et ante tempor congue. Phasellus ac tortor leo.
      Suspendisse finibus rhoncus ipsum, at ultrices dui faucibus eget. Nunc
      mauris lectus, mattis vel ex eget, maximus consectetur orci. Morbi nulla
      est, pretium quis lobortis in, viverra a arcu. Vivamus vehicula nisl sed
      quam elementum faucibus. Vestibulum semper tristique lectus. Proin congue
      diam ut enim sagittis feugiat. Duis ornare tortor vel euismod accumsan.
      Etiam eu mauris ac nisl iaculis cursus. Sed bibendum elit sit amet
      suscipit sagittis. Nulla felis risus, auctor ut tellus pellentesque,
      pellentesque sollicitudin lacus. In dignissim bibendum erat nec
      pellentesque. Donec a ligula lacinia, laoreet tellus a, sagittis mauris.
      pretium.
    </div>
  </body>
</html>
```

Y creamos este css

```css
.container {
  border: 1px solid black;
  padding: 15px;
}

.container img {
  width: 245px;
  margin: 5px;
}
```

Ahora queremos que la imagen se situe a la izquierda del texto. Podemos usar la propiedad _float_

```diff
.container {
  border: 1px solid black;
  padding: 15px;
}

.container img {
+ float: left;
  width: 245px;
  margin: 5px;
}
```

Que pasa? La imagen queda fuera del contenedor. Como lo solucionamos?

Primera aproximación modificamos el _html_

```diff
    <div class="container">
      <img
        src="https://cdn.pixabay.com/photo/2020/04/13/13/27/animal-5038385_960_720.jpg"
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu
      fringilla neque, nec maximus magna. Integer facilisis ex massa, vel
      iaculis erat finibus in. Nunc sapien justo, fringilla luctus risus
      rhoncus, mollis aliquam est. Quisque cursus massa non arcu pulvinar
      ultricies. Morbi eget quam et ante tempor congue. Phasellus ac tortor leo.
      Suspendisse finibus rhoncus ipsum, at ultrices dui faucibus eget. Nunc
      mauris lectus, mattis vel ex eget, maximus consectetur orci. Morbi nulla
      est, pretium quis lobortis in, viverra a arcu. Vivamus vehicula nisl sed
      quam elementum faucibus. Vestibulum semper tristique lectus. Proin congue
      diam ut enim sagittis feugiat. Duis ornare tortor vel euismod accumsan.
      Etiam eu mauris ac nisl iaculis cursus. Sed bibendum elit sit amet
      suscipit sagittis. Nulla felis risus, auctor ut tellus pellentesque,
      pellentesque sollicitudin lacus. In dignissim bibendum erat nec
      pellentesque. Donec a ligula lacinia, laoreet tellus a, sagittis mauris.
      pretium.
+     <div class="cleared"></div>
    </div>
```

Y ahora le damos estilos a _cleared_

```diff
...
+.cleared {
+  clear: both;
+}
```

No es elegante porque estamos mezclando responsabilidad. Introducimos un elemento html para solucionar un problema de css.

Otra solucion, utilizar pseudolemento: 

```diff
    <div class="container">
      <img
        src="https://cdn.pixabay.com/photo/2020/04/13/13/27/animal-5038385_960_720.jpg"
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu
      fringilla neque, nec maximus magna. Integer facilisis ex massa, vel
      iaculis erat finibus in. Nunc sapien justo, fringilla luctus risus
      rhoncus, mollis aliquam est. Quisque cursus massa non arcu pulvinar
      ultricies. Morbi eget quam et ante tempor congue. Phasellus ac tortor leo.
      Suspendisse finibus rhoncus ipsum, at ultrices dui faucibus eget. Nunc
      mauris lectus, mattis vel ex eget, maximus consectetur orci. Morbi nulla
      est, pretium quis lobortis in, viverra a arcu. Vivamus vehicula nisl sed
      quam elementum faucibus. Vestibulum semper tristique lectus. Proin congue
      diam ut enim sagittis feugiat. Duis ornare tortor vel euismod accumsan.
      Etiam eu mauris ac nisl iaculis cursus. Sed bibendum elit sit amet
      suscipit sagittis. Nulla felis risus, auctor ut tellus pellentesque,
      pellentesque sollicitudin lacus. In dignissim bibendum erat nec
      pellentesque. Donec a ligula lacinia, laoreet tellus a, sagittis mauris.
      pretium.
-     <div class="cleared"></div>
    </div>
```

y el css

```diff
.container {
  border: 1px solid black;
  padding: 15px;
}

+.container::after {
+  content: "";
+  display: block;
+  clear: both;
+}

.container img {
  float: left;
  width: 245px;
  margin: 5px;
}

-.cleared {
-  clear: both;
-}
```
