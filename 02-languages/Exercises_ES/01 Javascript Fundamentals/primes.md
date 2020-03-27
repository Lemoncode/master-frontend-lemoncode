# Primes

Crea una función tal que, dado un número entero de inicio `from` y otro de fin `to`, encuentre los números primos entre ellos y los muestre por pantalla.

```javascript
function showPrimes(from, to) {
  // Implementation here.
}
```

Asi pues, la salida desde el 1 al 10 sería:

```
1 is not a prime
2 is PRIME!
3 is PRIME!
4 is not a prime
5 is PRIME!
8 is not a prime
9 is not a prime
10 is not a prime
```

Utiliza la función para explorar todos los primos hasta el 100.

TIP: Puedes crearte una función auxiliar para saber si un número es primo o no, y utilizarla en tu función principal. Es buena práctica crear funciones auxiliares que hagan una sola cosa (principio de única responsabilidad).

## Challenge

Se puede mejorar mucho el rendimiento del ejercicio anterior.
Al buscar si un numero es primo, podemos dejar de comprobar si es divisible por cada entero mayor que 1 una vez alcancemos la raiz cuadrada de dicho número.

**TIP**: Explora en la documentación todas las funciones matemáticas que nos
ofrece JavaScript mediante el interfaz `Math`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
