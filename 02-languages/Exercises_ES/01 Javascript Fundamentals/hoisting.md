# Hoisting

## Apartado A

¿Cual crees que será el resultado de la consola y porqué?

**TIP**: escribe el código equivalente.

```javascript
function f() {
  console.log(a);
  console.log(g());

  var a = "good job!";
  function g() {
    return a;
  }
  console.log(a);
}
```

## Apartado B

¿Y ahora?

```javascript
var a = 1;

(function() {
  console.log(a);
  var a = 2;
  b = 4;
  var c = 3;
})();

console.log(a);
console.log(b);
console.log(c);
```

## Apartado C

¿Y con esta ligera variación?

```javascript
f();
var a = 1;

function f() {
  console.log(a);
  b = 4;
  var c = 3;
}

console.log(a);
console.log(b);
console.log(c);
```
