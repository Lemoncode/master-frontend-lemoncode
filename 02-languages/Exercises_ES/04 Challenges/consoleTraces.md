# Trazas por consola

Ejecuta el siguiente código:

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const showMessage = async ([time, message]) => {
  await delay(time);
  console.log(message);
};

const triggers = [
  async () => await showMessage([200, "third"]),
  async () => await showMessage([100, "second"]),
];

const run = triggers => {
  console.log("first");
  triggers.forEach(t => t());
};

run(triggers);
```

Las trazas resultante en consola son:

```js
first;
second;
third;
```

El ejercicio consiste en reordenar las trazas para que se muestren invertidas, es decir, con el siguiente orden:

```js
third;
second;
first;
```

Pero para ello **tan solo podrás modificar la función `run`**.

Queda prohibido modificar cualquier otro código asi como el contenido de `triggers`.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
