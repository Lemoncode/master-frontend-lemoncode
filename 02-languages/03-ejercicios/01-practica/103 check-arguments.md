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

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
