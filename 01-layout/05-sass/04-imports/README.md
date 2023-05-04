# Imports

Siguiendo con el ejemplo anterior podemos mover las variables a un fichero base

Creamos un fichero base.scss.

***base.css***
```diff
+ $primary-color: darkorange;
+ $secondary-color: skyblue;
+ $text-color: darkblue;
+ $font-base-size: 1.3em;
+ $link-font-size: 1.5em;
```

Eliminamos las variables de la hoja de estilo e importamos el base

***styles.css***
```diff
- $primary-color: darkorange;
- $secondary-color: skyblue;
- $text-color: darkblue;
- $font-base-size: 1.3em;
- $link-font-size: 1.5em;

@import "base";
```

Comprobamos que la importacion es correcta, ahora vamos a cambiarlo por @use

***styles.css***
```diff
- @import "base";
+ @use "base";
```

Ahora tenemos errores porque tenemos que especificar de donde vamos a obtener la variable.

Vamos a añadir el base a las variables que dan error:

```scss
@use "base";

p {
  .container-b & {
    background-color: base.$secondary-color;
    color: base.$text-color;
  }
}

.container-a {
  & p {
    font-size: base.$font-base-size;
    background-color: base.$primary-color;
    color: base.$text-color;
  }
}
```
