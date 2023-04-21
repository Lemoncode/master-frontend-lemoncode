## Order

Vamos a cambiar el orden de los elementos

```diff
+ #box4 {
+  order: 1;
+ }

+ #box1 {
+  order: 4;
+ }
```

¿Por que no se ponen el primero el box4? Porque por defecto el orde es 0.

Vamos a probar con esto

```diff
#box4 {
-  order: 1;
+ order: -1;
}
```

Ahora si, ya tenemos el box4 como el primer elemento.

¿Que opinais sobre esta manipulación de los elementos html?