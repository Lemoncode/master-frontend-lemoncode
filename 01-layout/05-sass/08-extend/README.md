# Extend

Vamos a crear un ejemplo con extend

Lo primero es borrar el _html_ y poner estos elementos:

***index.html***

```diff
  <body>
+    <div class="button">Click!</div>
  </body>
```

Borramos el css y creamos nuestra clase button

***style.scss***

```diff
+ @use "base" as *;

+ .button {
+  padding: 1rem;
+  border: 1px solid black;
+  border-radius: 0.5rem;
+  display: inline-block;
+}
```

Y ahora queremos crear un boton pero con el color de fondo cambiado...¿Tenemos que repetir todas la propiedades de boton?

***index.html***

```diff
  <body>
    <div class="button">Click!</div>
+   <div class="primary-button">Click!</div>
  </body>
```

Y ahora queremos reutilizar los estilos para otro elemento:

***style.scss***

```diff
@use "base" as *;

.button {
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  display: inline-block;
}

+.primary-button {
+  @extend .button;
+  background-color: $primary-color;
+}
```

Pero tambien podemos definir que todos los elementos de tipo primary tenga el fondo naranja. Entonces la regla quedaria de la siguiente forma

```diff
.button {
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  display: inline-block;
}

+.primary-element {
+  background-color: $primary-color;
+}

.primary-button {
  @extend .button;
-  background-color: $primary-color;
+ @extend .primary-element;
}
```


## incluir los MIXIN en el ejemplo.

Vamos a darle una sombra solamente al primary-button, y la queremos definir dependiendo de un valor.

***base.scss***

```diff
$primary-color: darkorange;
$secondary-color: skyblue;
$text-color: darkblue;
$font-base-size: 1.3em;
$link-font-size: 1.5em;
$breakpoint-sm: 600px;
$grid-item-base-color: darkblue;

+ @mixin shadow-effect($shadow: 5px) {
+   box-shadow: 6px 10px $shadow rgba(0, 0, 0, 0.69);
+
+  &:hover {
+    box-shadow: 3px 5px $shadow rgba(0, 0, 0, 0.69);
+  }
+ }
```
Y ahora lo utilizamos en nuestro boton valor por defecto.

```diff
.button {
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  display: inline-block;
}

.primary-element {
  background-color: $primary-color;
}

.primary-button {
  @extend .button;
  @extend .primary-element;
+ @include shadow-effect();
}
```

Y ahora cambiamos como se difumina la sombra:

```diff
.button {
  padding: 1rem;
  border: 1px solid black;
  border-radius: 0.5rem;
  display: inline-block;
}

+.primary-element {
+  background-color: $primary-color;
+}

.primary-button {
  @extend .button;
  @extend .primary-element;
+  @include shadow-effect(15px);
-  @include shadow-effect();
}
```