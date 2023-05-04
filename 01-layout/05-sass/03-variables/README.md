# Variables

Vamos a empezar a jugar con las variables.

Vamos a crear el siguiente diseño:

- Un contenedor (A) que contendrá un párrafo.
- Un contenedor (B) que contendrá un párrafo.
- Un ancla colocada fuera de ambos contenedores.

```diff
<body>
+ <div class="container-a">
+   <p>Container A paragraph</p>
+ </div>
+ <div class="container-b">
+   <p>Container B paragraph</p>
+ </div>
+ <a>This is a link</a>
</body>
```

Vamos a por la hoja de estilos, vamos a borrar todo el contenido actual
del archivo _scss_ y definamos algunas variables:

```scss
$primary-color: darkorange;
$secondary-color: skyblue;
$text-color: darkblue;
$font-base-size: 1.3em;
$link-font-size: 1.5em;
```

Vamos a utilizar estas variables en nuestras definiciones de estilo, aprovechando la oportunidad de jugar con el operador anidado &:

- Vamos a dar estilo a los párrafos.
- En la regla anidada vamos a apuntar a _container-a_ y con el operador &
  vamos a indicar que debe dirigirse al párrafo padre.

```diff
$font-base-size: 1.3em;
$link-font-size: 1.5em;
+   p {
+     .container-a & {
+     font-size: $font-base-size;
+     background-color: $primary-color;
+     color: $text-color;
+   }
+ }
```

Genial, así que ahora estamos usando el operador & de una nueva manera, y estamos asignando
valores a algunas propiedades no está mal, podemos hacer lo mismo en _container-b_

```diff
$font-base-size: 1.3em;
$link-font-size: 1.5em;
p {
  .container-a & {
  font-size: $font-base-size;
  background-color: $primary-color;
  color: $text-color;
}
+ .container-b & {
+   background-color: $secondary-color;
+   color: $text-color;
+ }
}
```

Para el elemento link vamos a asignar algunos valores de variables a algunas propiedades y personalizar el estado hover.

```diff
  .container-b & {
    background-color: $secondary-color;
    color: $text-color;
  }
}

+ a {
+   font: {
+     size: $link-font-size;
+     weight: bold;
+   }
+
+   &:hover {
+     color: $primary-color;
+   }
+ }
```

Así que ahora tenemos nuestro enlace usando los valores de las variables que hemos definido anteriormente, la ventaja de esto es que si, por ejemplo, mañana cambia la paleta de colores de los estilos corporativos de la empresa, sólo tengo que tocarlo en un sitio para actualizarlo en mi sitio.

La forma en que SASS trabaja con las variables es diferente a como lo hace html, cuando las variables de SASS pasan por el procesador, todo queda en constantes repetidas en mil lugares, por ejemplo si tengo una variable con un
un color que uso en 30 sitios, se sustituye en esos 30 sitios por el literal con el color, así que cuando tienes una variable SASS y la pasas a css estas desaparecen, no hay más variables sass.

Una cosa interesante es que con SASS puedes usar variables en media queries, por ejemplo:

```css
$breakpoint-sm: 600px;

@media screen and (max-width: $breakpoint-sm) {
  p {
    font-size: 30px;
  }
}
```
