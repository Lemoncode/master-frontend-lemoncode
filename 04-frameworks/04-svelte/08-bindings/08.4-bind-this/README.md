# 01 - Limpiar el Boilerplate

## Resumen

Ya tenemos creado y corriendo nuestro primer proyecto de **Svelte**. Vamos a echar un ojo a lo que nos ha creado y hacer una limpieza para seguir con los siguientes ejemplos.

## Paso a paso

### ¿Qué nos ha creado la plantilla?

```diff
<script lang="ts">
+  import { onMount } from 'svelte';
+  import svg from './assets/lemon.svg';

+  let logo: HTMLImageElement;

+  onMount(() => {
+    let i = 0;
+    const interval = setInterval(() => {
+      i++;
+      logo.style.transform = `rotate(${i}deg)`;
+    }, 50);

+    return () => clearInterval(interval);
+  });
</script>

<main>
  <h1>Hello Svelte!</h1>
+  <img bind:this={logo} alt="" src={svg} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }

+  :global(body) {
+    text-align: center;
+  }

+  img {
+    width: 50%;
+  }
</style>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
