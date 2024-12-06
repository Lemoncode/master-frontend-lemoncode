# Comprendiendo JS

## Cuestión 1

¿Existe alguna forma de que la expresión `x === x` de como resultado `false`?

```js
const x = ¿?

console.log(x === x); // false
```

## Cuestión 2

Habiendo resuelto la **Cuestión l**, ¿como implementarías una función que compruebe si un determinado valor es `NaN`?

```js
const isNaNValue = v => ?

console.log(isNaNValue(NaN)); // true
```

## Cuestión 3

Habiendo resuelto la **Cuestion 2** ¿Existe alguna forma de que la expresión `!isNaNValue(x) && x !== x` de como resultado `true`? No debes modificar la implementación `isNaNValue` en este ejercicio.

```js
// ¿x? <= Debes ingeniar un "x" que provoque lo siguiente:

console.log(!isNaNValue(x) && x !== x); // true
```

## Cuestión 4

¿Podrías dar con alguna forma de que la expresión `x + 1 === x - 1` arroje `true`?

```js
const x = ¿?

console.log(x + 1 === x - 1); // true
```

## Cuestión 5

Se te ocurre alguna forma de hacer que la expresión `x > x` de como resultado `true`?

```js
const x = ¿?

console.log(x > x); // true
```
