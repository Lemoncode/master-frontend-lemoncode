# SASS Using control directives

## 1. Creamos un documento HTML básico

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Dynamic grid</title>
    <link rel="stylesheet" href="./css/style.css" type="text/css" />
  </head>
  <body>
    <div class="container">
      <div class="col-1"></div>
      <div class="col-1"></div>
      <div class="col-2"></div>
      <div class="col-1"></div>
      <div class="col-1"></div>
    </div>
  </body>
</html>
```

### Compilar Sass desde node-sass

Como vimos durante el curso, necesitamos compilar el fichero de Sass para poder utilizarlo directamente en el HTML, por tanto, vamos a hacer uso de `npx` para poder ejecutar sin instalar el paquete `node-sass` y llevar a cabo esta tarea.

Antes que nada, levantamos nuestro proyecto con Live Server como hemos hecho anteriormente.

Seguidamente ejecutamos en la consola la siguiente línea:

```
npx node-sass -w style.scss -o css
```

Con esto lo que estamos diciendo es que Node Sass deberá estar en modo vigilante sobre el fichero `style.scss` de modo que al guardar el fichero, lance un proceso de compilación. Y con el atributo `-o css` le estamos diciendo que la salida de ese fichero css generado, lo haga en una carpeta llamada css.

Si ahora entramos en el fichero `style.scss` y le damos a guardar, veremos en la consola cómo nos avisa que el fichero ha cambiado y está compilando la salida a css.

Una vez hecho esto, ya tenemos todo listo.

### 2. Nuestro objetivo es crear un sistema de cuadrícula dinámica, donde podrá ser definido automáticamente el número de columnas, no estando sujeto a un número rígido de columnas como ocurre en otros sistemas de rejilla como Bootstrap donde estamos atados a 12 columnas.

_./\_functions.scss_

```scss
@function calculate-width($colNumber, $numberOfColumns) {
  $result: 100% * ($colNumber / $numberOfColumns);
  @return $result;
}
```

_./\_mixins.scss_

```scss
@import "functions.scss";

@mixin calculate-columns($numberOfColumns: 1) {
  @for $colNumber from 1 through $numberOfColumns {
    .col-#{$colNumber} {
      width: calculate-width($colNumber, $numberOfColumns);
      float: left;
      box-sizing: border-box;
      border: 0.3em solid black;
    }
  }
}
```

- Esto generará un número de columnas entre uno y el total de números pasado como parámetro a la función `calculate-columns`.

### 3. Ahora vamos a usarlo en el `style.scss`

_./style.scss_

```scss
@import "mixins.scss";

.container {
  padding-left: 1em;
  padding-right: 1em;

  div:nth-of-type(2n + 1) {
    background-color: lighten(yellow, 25%);
  }

  div:nth-of-type(2n) {
    background-color: lighten(cyan, 25%);
  }
}

[class^="col-"] {
  height: 12em;
}

@media (min-width: 250px) {
  @include calculate-columns(1);
}

@media (min-width: 500px) {
  @include calculate-columns(2);
}

@media (min-width: 1200px) {
  @include calculate-columns(6);
}
```
