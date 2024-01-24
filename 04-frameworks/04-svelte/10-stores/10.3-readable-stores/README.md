# 10.3 - Readable stores

## Resumen

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

Un `readable store` no permite la modificación de su estado desde fuera del propio `store`. Esto significa que el propio `store` es el único que puede modificar su estado de forma interna.

Como ejemplo, vamos a crear un `readable store` que se actualiza cada segundo con la hora actual.

### Crear el `readable store`

_current-time.store.ts:_

```ts
import { readable } from 'svelte/store';

export const currentTime = readable(new Date(), set => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  // return stop function
  return () => {
    clearInterval(interval);
  };
});
```

### Consumir el `readable store`

_App.svelte:_

```diff
<script lang="ts">
+  import { currentTime } from './current-time.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <h2>The current time is {$currentTime.toLocaleTimeString()}</h2>
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
