# Fibonacci

Implementa una función para calcular el n-enésimo termino de la sucesión de Fibonacci. Esta sucesión tiene sus dos primeros términos prefijados:

```
fib(0) = 0
fib(1) = 1
```

Y a partir de aqui, el siguiente término se calcula a partir de los dos anteriores:

```
fib(2) = fib(1) + fib(0)
...
fib(n + 1) = fib(n) + fib(n - 1)
```

**TIP**: Es el clásico problema donde el término siguiente depende del actual y el anterior.

**TIP**: También se puede abordar con recursividad, pero buscamos una solución iterativa para hacer uso de destructuring con múltiples asignaciones.

```javascript
const fib = n => {
  /* Implementation here*/
};
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
