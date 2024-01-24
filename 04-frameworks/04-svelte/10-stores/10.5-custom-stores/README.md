# 10.5 - Custom stores

## Resumen

Vamos a partir del ejemplo [10.1-writable-stores](../10.1-writable-stores/).

## Paso a paso

Un `store` es simplemente un objeto que contiene cierto estado de nuestra aplicación, con un método `subscribe` que permite subscribirnos a los cambios del valor de dicho estado. En este caso vamos a utilizar un `store` de tipo `writable` que nos permite modificar el valor mediante los métodos `set` y `update`.

### Crear un writable store

Como ya hemos comentado, un `store` es simplemente un objeto que contiene cierto estado de nuestra aplicación, con un método `subscribe` que permite subscribirnos a los cambios del valor de dicho estado. Este valor puede modificarse mediante los métodos `set` y `update`. Podemos crear un `custom store` simplemente creando un objeto con los métodos `subscribe`, `set` y `update`, incluso encapsulando la lógica de negocio en una función que devuelva dicho objeto:

_counter.store.ts:_

```diff
import { writable } from 'svelte/store';

- export const counter = writable(0);

+ const createCounterStore = () => {
+   const counter = writable(0);
+
+   const increment = () => counter.update(n => n + 1);
+   const decrement = () => counter.update(n => n - 1);
+   const reset = () => counter.set(0);
+
+   return {
+     subscribe: counter.subscribe,
+     increment,
+     decrement,
+     reset,
+   };
+ };
+
+ export const counter = createCounterStore();
```

### Suscribirnos y utilizar el `custom store`

Ahora vamos a utilizar el `custom store` en el componente `App`. Podemos subscribirnos a los cambios del valor del `store` mediante el método `subscribe` y podemos modificar el valor del `store` mediante los métodos `increment`, `decrement` y `reset` que hemos expuesto en el `store`:

_app.svelte:_

```diff
<script lang="ts">
  import { counter } from './counter.store';

  let count: number;

  const unsubscribe = counter.subscribe(value => {
    count = value;
  });

  onDestroy(unsubscribe);
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <h2>Counter: {count}</h2>

-  <button on:click={() => counter.update(n => n + 1)}>+1</button>
-  <button on:click={() => counter.update(n => n - 1)}>-1</button>
-  <button on:click={() => counter.set(0)}>Reset</button>
+  <button on:click={counter.increment}>+1</button>
+  <button on:click={counter.decrement}>-1</button>
+  <button on:click={counter.reset}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

## Autosubscripción a un `custom store`

Tal como hacemos con un `store` normal, podemos utilizar la sintaxis de `$` para autosubscribirnos a los cambios de un `custom store`:

```diff
<script lang="ts">
-  import { onDestroy } from 'svelte';
  import { counter } from './counter.store';

-  let count: number;

-  const unsubscribe = counter.subscribe(value => {
-    count = value;
-  });

-  onDestroy(unsubscribe);
</script>

<main>
  <h1>Hello Svelte!</h1>
-  <h2>Counter: {count}</h2>
+  <h2>Counter: {$counter}</h2>

  <button on:click={counter.increment}>+1</button>
  <button on:click={counter.decrement}>-1</button>
  <button on:click={counter.reset}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

## ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
