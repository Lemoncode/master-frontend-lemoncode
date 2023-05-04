# Color functions

Vamos a partir de un nuevo html

***index.html***

```diff
+ <body>
+    <div class="grid-container">
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+      <div class="item"></div>
+    </div>
+  </body>
```

Vamos a crear una variable nueva en nuestro fichero base

***base.scss***

```diff
...

+ $grid-item-base-color: darkblue;
```

Y probamos las funciones de colores:

***styles.scss***

```scss
@import "base";

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 200px);
  grid-template-rows: repeat(2, 200px);

  .item:nth-child(1) {
    background-color: lighten($color: $grid-item-base-color, $amount: 50%);
  }

  .item:nth-child(2) {
    background-color: darken($color: $grid-item-base-color, $amount: 50%);
  }

  .item:nth-child(3) {
    background-color: saturate($color: $grid-item-base-color, $amount: 50%);
  }

  .item:nth-child(4) {
    background-color: desaturate($color: $grid-item-base-color, $amount: 50%);
  }

  .item:nth-child(5) {
    background-color: fade-in($color: $grid-item-base-color, $amount: 0.5);
  }

  .item:nth-child(6) {
    background-color: fade-out($color: $grid-item-base-color, $amount: 0.5);
  }

  .item:nth-child(7) {
    background-color: invert($color: $grid-item-base-color);
  }

  .item:nth-child(8) {
    background-color: complement($color: $grid-item-base-color);
  }
}
```
