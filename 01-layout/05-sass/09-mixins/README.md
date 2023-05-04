# Mixins

Vamos a crear nuestro primer mixin

***base.scss***

```diff
$primary-color: darkorange;
$secondary-color: skyblue;
$text-color: darkblue;
$font-base-size: 1.3em;
$link-font-size: 1.5em;

$grid-item-base-color: darkblue;

+@mixin rounded-corners-all($size: 0.5rem) {
+  border-radius: $size;
+}

```

Vamos a cambiar los elementos del html

***index.html***

```diff
  <body>
+    <div class="box-style-1"></div>
+    <div class="box-style-2"></div>
  </body>

```

Y ahora definimos los estilos:

***style.scss***

```scss
@import "base";

.box-style-1,
.box-style-2 {
  width: 25%;
  height: 10rem;
  margin: 1rem;
  background-color: darkorange;
}

.box-style-1 {
  @include rounded-corners-all;
}

.box-style-2 {
  @include rounded-corners-all(2rem);
}
```
