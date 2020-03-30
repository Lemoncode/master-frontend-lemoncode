# Args

Dada la siguiente función:

```javascript
function f(a, { b } = {}, c = 100) {
  console.log(arguments.length);
  console.log(a, a === arguments[0]);
  console.log(b, b === arguments[1]);
  console.log(c, c === arguments[2]);
}
```

## Apartado A

¿Qué muestra por consola esta llamada?

```javascript
f("JS rocks!", { b: "b" });
```

## Apartado B

¿Y con estos argumentos?

```javascript
f({ b: "b" });
```

## Apartado C

¿Y ahora?

```javascript
f("JS sucks!", null, 13);
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
