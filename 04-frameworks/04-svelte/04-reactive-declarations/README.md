# 04 - Declaraciones reactivas

## Resumen

¿Cómo podemos conseguir estados que sean reactivos a cambios de otros estados?

Partiremos del ejemplo anterior [03-reactive-statements](../03-reactive-statements/).

## Paso a paso

Imaginemos que deseamos tener un estado que depende de otro, por ejemplo `double` que es el doble de lo que contenga `counter`. Ya sabemos (por el ejemplo anterior) que necesitamos tener un bloque de código reactivo para calcular el valor de `double` cada vez que cambia `counter`:

```diff
<script lang="ts">
  let counter = 0;
+  let double = counter * 2;

+  $: {
+    double = counter * 2;
+  }

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }
</script>

<main>
  <h1>Counter {counter}</h1>
+  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

En estos casos, podemos declarar directamente la variable `double` de la siguiente manera (sin declararla específicamente):

```diff
<script lang="ts">
  let counter = 0;
-  let double = counter * 2;

-  $: {
-    double = counter * 2;
-  }

+  $: double = counter * 2;

  $: console.log(counter);

  $: if (counter > 10) {
    counter = 0;
  }
</script>

<main>
  <h1>Counter {counter}</h1>
  <h2>Double: {double}</h2>
  <button
    on:click={() => {
      counter = counter + 1;
    }}>
    Increment!
  </button>
</main>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
