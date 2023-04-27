# Negative Positioning

Hasta ahora hemos jugado con numeros positivos al posicionar.

Vamos a probar con los numero negativos y veremos que escenario puede cubrir.

Vamos a posicionar el elemento item1

- Pondremos el column-end en un número negativo (en este caso -1 es el final de la última línea en el lado de la columna)

```diff
#item1 {
- grid-column: first / span 4;
+ grid-column: first / -1;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```
