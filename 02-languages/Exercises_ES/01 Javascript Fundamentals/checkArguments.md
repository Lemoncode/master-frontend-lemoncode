# Check Arguments

Es muy habitual en javascript, al recibir argumentos de una función, querer asegurarnos de que no sean `undefined` o `null`. En este ejercicio debes convertir el código de abajo en algo equivalente pero más compacto y expresivo.

**TIP**: Piensa en el operador ternario y también en el operador OR.

**TIP**: Puedes suponer que input es siempre de tipo string, incluyendo `null` o `undefined`. Es decir, no vas a recibir números, objetos, etc.

```javascript
function f(input) {
  var result;
  if (input === undefined) {
    result = "Unknown";
  } else if (input === null) {
    result = "";
  } else {
    result = input;
  }
  return result;
}
```
