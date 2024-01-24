# 10.1 - Writable stores

## Resumen

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

Un `store` es simplemente un objeto que contiene cierto estado de nuestra aplicación, con un método `subscribe` que permite subscribirnos a los cambios del valor de dicho estado. En este caso vamos a utilizar un `store` de tipo `writable` que nos permite modificar el valor mediante los métodos `set` y `update`.

### Crear un writable store

_counter.store.ts:_

```ts
import { writable } from 'svelte/store';

export const counter = writable(0);
```

### Suscribirnos y utilizar el store

Ahora vamos a utilizar el `store` en el componente `App`:

_app.svelte:_

```diff
<script lang="ts">
+  import { counter } from './counter.store';

+  let count: number;

+  counter.subscribe(value => {
+    count = value;
+  });
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <h2>Counter: {count}</h2>

+  <button on:click={() => counter.update(n => n + 1)}>+1</button>
+  <button on:click={() => counter.update(n => n - 1)}>-1</button>
+  <button on:click={() => counter.set(0)}>Reset</button>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

### Desuscribirnos del store

Si nos fijamos, en el ejemplo anterior nos hemos suscrito al `store` pero no nos hemos desuscrito. Esto puede provocar que el componente siga escuchando los cambios del `store` aunque ya no se esté utilizando o el componente se haya desmontado del DOM. Para evitar esto, podemos utilizar el método `unsubscribe` que nos devuelve el `store` al suscribirnos:

_app.svelte:_

```diff
<script lang="ts">
+  import { onDestroy } from 'svelte';
  import { counter } from './counter.store';

  let count: number;

-  counter.subscribe(value => {
+  const unsubscribe = counter.subscribe(value => {
    count = value;
  });

+  onDestroy(unsubscribe);
</script>

<main>
  <h1>Hello Svelte!</h1>
  <h2>Counter: {count}</h2>

  <button on:click={() => counter.update(n => n + 1)}>+1</button>
  <button on:click={() => counter.update(n => n - 1)}>-1</button>
  <button on:click={() => counter.set(0)}>Reset</button>
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
