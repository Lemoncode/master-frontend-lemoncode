# PROPIEDADES FLEX-GROW, FLEX-SHRINK Y FLEX-BASIS

La forma de crearse los elementos flex en principio es ajustándose al contenido. Este mecanismo en principio no es flexible.

Vamos a ver cómo podemos disponer de unas propiedades que nos ayudarán a diseñar interfaces de usuario flexibles independientemente del contenido que tengan.

Partiremos del HTML y CSS del ejemplo **02-order**.

Antes de comenzar, vamos a realizar una refactorización en el css para separar las clases comunes de los elementos flex de las particulares.

```diff
+ .elemento-flex {
+   padding: 10px;
+ }

- .elemento-flex {
+ .elemento-flex:first-child {
-  padding: 10px;
  background-color: #9e3332;
}

.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
  order: -1;
}

.elemento-flex:nth-child(3) {
  background-color: #b5b33f;
}
```

## Flex Grow

Con la propiedad `flex-grow` podemos indicar un factor de crecimiento para un elemento.

Por ejemplo, si queremos que todos los elementos crezcan de forma uniforme hasta ocupar el ancho del contenedor flexbox podemos hacerlo definiendo `flex-grow` en todos con valor 1.

```diff
.elemento-flex {
  padding: 10px;
+  flex-grow: 1;
}
```

Pero también podemos definir que sólo uno de los elementos crezca un determinado factor.

```diff
.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
  order: -1;
+  flex-grow: 2;
}
```

## Flex Shrink

Vamos a refactorizar nuestro HTML

```html
<div class="contenedor">
  <h1>Conceptos Flexbox</h1>

  <div class="contenedor-flex">
    <div class="elemento-flex normal">
      <h2>Elemento 1</h2>
    </div>
    <div class="elemento-flex normal">
      <h2>Elemento 2</h2>
    </div>
    <div class="elemento-flex normal">
      <h2>Elemento 3</h2>
    </div>
    <div class="elemento-flex small" style="background-color: yellow">
      <h2>Elemento 4</h2>
    </div>
    <div class="elemento-flex small" style="background-color: green">
      <h2>Elemento 5</h2>
    </div>
  </div>
</div>
```

Y el CSS

```css
* {
  box-sizing: border-box;
}

body,
html {
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
  display: flex;
}

.elemento-flex {
  padding: 10px;
}

.elemento-flex:first-child {
  background-color: #9e3332;
}

.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
}

.elemento-flex:nth-child(3) {
  background-color: #b5b33f;
}

.normal {
}

.small {
}
```

Comenzaremos estableciendo un ancho de 700px al contenedor flex

```diff
.contenedor-flex {
  border: 3px solid black;
  display: flex;
+  width: 700px;
}
```

Lo siguiente será establecer un `flex-basis` de 180px a cada elemento flex

```diff
.elemento-flex {
  padding: 10px;
+  flex-basis: 180px;
}
```

Recordemos que esta propiedad lo que hace es establecer el ancho del elemento antes de las transformaciones con `flex-grow` y `flex-shrink`, es decir, desde que ancho partirán dichas transformaciones.

Ahora vamos a aplicar un `flex-shrink` de 1 a la clase `.normal` y de 2 a la clase `.small`.

```diff
.normal {
+  flex-shrink: 1;
}

.small {
+  flex-shrink: 2;
}
```

Y como podemos ver, los elementos 1, 2 y 3 (clase `.normal`) han reducido su tamaño en una proporción menor a los elementos 4 y 5 (clase `.small`)
