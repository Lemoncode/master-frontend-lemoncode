# PROPIEDAD ORDER

Vamos a partir del HTML y CSS del ejemplo **01-flexbox-fundamentals**:

## Order

Como vemos tenemos nuestros elementos mostrándose como Elemento 1, Elemento 2 y Elemento 3. Imagina que quisiéramos mostrar el Elemento 2 en primera posición sin tocar el HTML.

Flexbox nos da la capacidad de poder ordenar los elementos flex como queramos. Para ello tenemos que agregar reglas a los elementos hijos.

Vamos a ver cómo podríamos poner el Elemento 2 en primera posición:

- Podemos hacerlo estableciendo un orden para todos los elementos.

```diff
.elemento-flex {
  padding: 10px;
  background-color: #9e3332;
+  order: 1;
}

.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
+  order: 0;
}

.elemento-flex:nth-child(3) {
  background-color: #b5b33f;
+ order: 2;
}
```

- También podemos simplemente ponerle un orden -1 al elemento que queremos situar el primero.

```diff
.elemento-flex {
  padding: 10px;
  background-color: #9e3332;
-  order: 1;
}

.elemento-flex:nth-child(2) {
  background-color: #ae42cc;
-  order: 0;
+  order: -1;
}

.elemento-flex:nth-child(3) {
  background-color: #b5b33f;
- order: 3;
}
```
