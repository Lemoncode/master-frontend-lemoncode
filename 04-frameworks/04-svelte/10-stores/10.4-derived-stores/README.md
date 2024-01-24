# 10.3 - Readable stores

## Resumen

Vamos a partir del ejemplo anterior [10.3-readable-stores](../10.3-readable-stores/).

## Paso a paso

Un `derived store` es un tipo de store que se crea a partir de otro store. En este caso, el store original se conoce como `source store` y el nuevo store se conoce como `derived store`. El `derived store` se actualiza cada vez que el `source store` cambia.

Como ejemplo, vamos a crear un `derived store` a partir del `readable store` que creamos en el ejemplo anterior. El `derived store` va a ser un `string` que contenga la hora actual en formato `hh:mm:ss`.

### Crear el `derived store`

Lo podemos crear en un fichero nuevo, por ejemplo `current-time-formatted.store.ts`, pero por evitar ruido para el ejemplo, lo crearemos dentro del propio fichero `current-time.store.ts`:

_current-time.store.ts:_

```diff
- import { readable } from 'svelte/store';
+ import { readable, derived } from 'svelte/store';

export const currentTime = readable(new Date(), set => {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  // return stop function
  return () => {
    clearInterval(interval);
  };
});

+ export const currentTimeFormatted = derived(currentTime, $currentTime => {
+   return $currentTime.toLocaleTimeString();
+ });
```

### Consumir el `derived store`

_App.svelte:_

```diff
<script lang="ts">
-  import { currentTime } from './current-time.store';
+  import { currentTimeFormatted } from './current-time.store';
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <h2>The current time is {$currentTimeFormatted}</h2>
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
