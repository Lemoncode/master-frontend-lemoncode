# 08.2 - Bind Checked

## Resumen

¿Cómo podemos hacer `bind` a un input de tipo `checkbox`?

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Usando `bind:checked`

Al igual que con los _inputs_ de tipo `text`, `numeric` o `range`, podemos bindear un estado con la propiedad `checked` de los _inputs_ de tipo `checkbox`, con la directiva `bind:checked`:

_App.svelte_

```diff
<script lang="ts">
+  let accepted = false;
+  $: console.log(accepted);
</script>

<main>
  <h1>Hello Svelte!</h1>
+ <input type="checkbox" bind:checked={accepted} /> Accept terms and conditions.
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
