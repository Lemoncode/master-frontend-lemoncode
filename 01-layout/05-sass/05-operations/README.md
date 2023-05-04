# Operations

Vamos a crear una operacion simple para el calculo del tamaño de letra

***sytles.scss***

```diff
.container-a {
  & p {
-    font-size: base.$font-base-size;
+    font-size: base.$font-base-size * 1.2;
    background-color: base.$primary-color;
    color: base.$text-color;
  }
}
```
