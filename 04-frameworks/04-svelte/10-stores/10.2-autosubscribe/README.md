# 10.2 - Autosubscribe

## Resumen

Vamos a partir del ejemplo anterior [10.1-writable-stores](../10.1-writable-stores/).

## Paso a paso

### Autosubscribirnos al store

En el ejemplo anterior, nos subscribimos al store de forma manual:

```ts
let count: number;

const unsubscribe = counter.subscribe(value => {
  count = value;
});

onDestroy(unsubscribe);
```

Pero `Svelte` nos permite hacerlo de forma automática, accediendo al valor del `store` mediante `$`, sin tener que preocuparnos de la desuscripción:

_app.svelte:_

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
+  <h2>Counter: {$count}</h2>

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
