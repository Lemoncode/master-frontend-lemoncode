# 08.3 - Bind group

## Resumen

¿Y si tenemos multiples _inputs_ de tipo `radio` o `checkbox` pertenecientes a un mismo grupo?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Usando `bind:group`

Vamos a añadir dos grupos de _inputs_ de tipo `radio` y `checkbox`. Como sabemos, la diferencia entre estos tipos de inputs es que `radio` sólo puede haber uno seleccionado dentro del grupo, mientras que `checkbox` puede seleccionar varios:

_App.svelte_

```diff
<script lang="ts">
+  let phone = '';
+  let training = [];

+  $: console.log(phone, training);
</script>

<main>
  <h1>Hello Svelte!</h1>

+  <div>
+    <p>Select your mobile phone:</p>
+    <input type="radio" bind:group={phone} value="iphone" /> iPhone
+    <input type="radio" bind:group={phone} value="samsung" /> Samsung
+    <input type="radio" bind:group={phone} value="xiaomi" /> Xiaomi
+  </div>

+  <div>
+    <p>Select multiple:</p>
+    <input type="checkbox" bind:group={training} value="master-frontend" /> Master Frontend
+    <input type="checkbox" bind:group={training} value="bootcamp-backend" /> Bootcamp Backend
+    <input type="checkbox" bind:group={training} value="bootcamp-devops" /> Bootcamp DevOps
+  </div>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
