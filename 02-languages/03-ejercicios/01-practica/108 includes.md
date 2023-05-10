# Includes

En ES7 ya existe una función de manejo de arrays llamada `Array.includes()` que indica si un determinado valor figura entre los items de un array dado.
Crea una función en ES5 con el mismo comportamiento, es decir, una función que reciba un array y un valor y devuelva un `boolean` indicando si el valor está dentro del array.

```javascript
function includes(array, value) {
  // Implementation here
}

// Ejemplo:
console.log(includes([1, 2, 3], 3)); // true
console.log(includes([1, 2, 3], 0)); // false
```

## Challenge

El ejercicio anterior puede quedar simplificado si utilizas una función de los arrays
que devuelve el índice de un elemento dado.

**TIP**: Consulta la documentación en MDN sobre los arrays:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
